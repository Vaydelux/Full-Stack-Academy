/** Local qualification coordinator. No publication, deployment or database mutation. */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, mkdtempSync, writeFileSync, renameSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join, isAbsolute, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LOCKS = Object.freeze(['package-lock.json','examples/forms-query-vertical/react-client/package-lock.json','examples/nestjs-vertical/package-lock.json']);
export const STEPS = Object.freeze([
 Object.freeze({id:'dependency-audit',script:'audit:dependencies',timeout:300_000}),
 Object.freeze({id:'academy-and-p1-full',script:'qualify:forms-query:full',timeout:5_400_000}),
 Object.freeze({id:'p1-rhf-browser',script:'qualify:forms-query:rhf-browser',timeout:600_000}),
 Object.freeze({id:'p1-query-browser',script:'qualify:forms-query:query-browser',timeout:600_000}),
 Object.freeze({id:'p2-nestjs-runtime',script:'qualify:nestjs:architecture',timeout:1_800_000}),
]);
// A website release candidate includes curriculum and all documentation browser gates.
export const RELEASE_STEPS = Object.freeze([
 Object.freeze({id:'curriculum-source-audit',script:'qualify:release:source',timeout:300_000}),
 STEPS[0],
 Object.freeze({id:'workspace-dependency-audit',script:'audit:release:workspaces',timeout:600_000}),
 ...STEPS.slice(1),
 Object.freeze({id:'reading-edition-browser',script:'qualify:reading:browser',timeout:1_920_000}),
 Object.freeze({id:'responsive-discovery-browser',script:'qualify:f17:browser',timeout:360_000}),
 Object.freeze({id:'production-boundaries-browser',script:'qualify:f20:browser',timeout:360_000}),
]);
export const EXTERNAL_GATES = Object.freeze([
 'P2 actual PostgreSQL and socket integration',
 'P8 isolated Nest/PostgreSQL HTTP integrity (qualify:p8:nest-integrity, disposable database required)',
 'P3 PostgreSQL 17+ real SQL and recovery qualification',
 'P4 real Prisma/Supabase migration, Auth, RLS and storage',
 'P5 real PostgreSQL inbox/search/RLS, Redis and provider-native integrations',
 'Manual keyboard, screen reader, zoom and responsive review',
 'Module-specific editorial review and publication approval',
]);
const profileFor=profile=>{
 if(profile==='release')return {locks:LOCKS,steps:RELEASE_STEPS,external:[...EXTERNAL_GATES,'Deployment provenance, preview/production smoke and rollback approval']};
 if(profile==='all')return {locks:LOCKS,steps:STEPS,external:EXTERNAL_GATES};
 if(profile==='p1')return {locks:LOCKS.slice(0,2),steps:STEPS.slice(0,4),external:['P2 NestJS runtime qualification',...EXTERNAL_GATES]};
 throw Error('Invalid qualification profile');
};
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const isSha=s=>typeof s==='string'&&/^[0-9a-f]{40}$/.test(s);
const isDigest=s=>typeof s==='string'&&/^[0-9a-f]{64}$/.test(s);
const tool=(program,args,cwd)=>spawnSync(program,args,{cwd,encoding:'utf8',timeout:10_000,maxBuffer:8*1024*1024,windowsHide:true,shell:false});
function readGit(root,args){const r=tool('git',['-C',root,...args],root);if(r.error||r.status!==0)throw Error('git-preflight-failed');return r.stdout;}

export function inspectCheckout(root,env=process.env){
 let commit=null,clean=false,repoRoot=false,locks={},scripts={},npmReady=false,browserReady=false;
 try{repoRoot=realpathSync(readGit(root,['rev-parse','--show-toplevel']).trim())===realpathSync(root);commit=readGit(root,['rev-parse','HEAD']).trim();clean=readGit(root,['status','--porcelain=v1','--untracked-files=all']).trim()==='';}catch{/* blocked by preflight */}
 for(const file of LOCKS){try{readGit(root,['ls-files','--error-unmatch','--',file]);locks[file]=sha256(readFileSync(join(root,file)));}catch{/* not tracked or unreadable */}}
 try{scripts=JSON.parse(readFileSync(join(root,'package.json'),'utf8')).scripts??{};}catch{/* blocked by preflight */}
 const npm=env.npm_execpath;
 try{npmReady=typeof npm==='string'&&isAbsolute(npm)&&basename(npm)==='npm-cli.js'&&existsSync(npm);}catch{/* blocked */}
 try{if(env.ACADEMY_BROWSER_ROOT&&isAbsolute(env.ACADEMY_BROWSER_ROOT)){createRequire(join(env.ACADEMY_BROWSER_ROOT,'package.json')).resolve('playwright');browserReady=true;}}catch{/* blocked */}
 return {commit,clean,repoRoot,locks,scripts,npmReady,browserReady,node:process.version};
}
export function preflight(s,profile='all'){
 const {locks,steps}=profileFor(profile),blockers=[];
 const version=/^v24\.(\d+)\.\d+$/.exec(s.node??'');
 if(!version||Number(version[1])<9)blockers.push('Node 24.9+ (24.x stable) required');
 if(!s.repoRoot||!isSha(s.commit))blockers.push('Full Git checkout with valid HEAD required');
 if(s.clean!==true)blockers.push('Tracked and untracked checkout must be clean');
 for(const file of locks)if(!isDigest(s.locks?.[file]))blockers.push('Missing tracked lockfile: '+file);
 for(const step of steps)if(typeof s.scripts?.[step.script]!=='string'||!s.scripts[step.script].trim())blockers.push('Missing npm script: '+step.script);
 if(!s.npmReady)blockers.push('Invoke via npm run; npm-cli.js unavailable');
 if(!s.browserReady)blockers.push('ACADEMY_BROWSER_ROOT must resolve installed Playwright');
 return blockers;
}
export function sameCheckout(initial,current,profile='all'){return current.repoRoot===true&&current.clean===true&&current.commit===initial.commit&&profileFor(profile).locks.every(file=>current.locks?.[file]===initial.locks?.[file]);}
export function makeReport(initial,profile='all'){const {steps,external}=profileFor(profile);return {schemaVersion:1,profile,commit:isSha(initial.commit)?initial.commit:null,node:initial.node,lockSha256:initial.locks??{},status:'not-run',blockers:preflight(initial,profile),steps:steps.map(({id,script})=>({id,script,status:'not-run'})),externalGates:external.map(gate=>({gate,status:'not-run'})),publicationApproved:false};}
/** Injected execution is for tests. The CLI only runs its fixed npm allowlist. */
export function runQualification({probe,execute,save,profile='all',now=()=>new Date().toISOString()}){
 const {steps}=profileFor(profile),initial=probe(),report=makeReport(initial,profile);report.startedAt=now();
 const finish=status=>{report.status=status;report.finishedAt=now();save(report);return report;};
 if(report.blockers.length)return finish('blocked');
 report.status='running';save(report);
 for(let i=0;i<steps.length;i++){
  const row=report.steps[i],step=steps[i];
  if(!sameCheckout(initial,probe(),profile)){report.blockers.push('Checkout changed before '+step.id);return finish('invalidated');}
  row.status='running';row.startedAt=now();save(report);
  let result;try{result=execute(step);}catch{result={status:null,error:{code:'EXECUTION_ERROR'}};}
  row.finishedAt=now();row.exitCode=Number.isInteger(result?.status)?result.status:null;
  row.errorCode=result?.error?String(result.error.code??'EXECUTION_ERROR').slice(0,80):null;
  row.signal=result?.signal??null;
  row.status=row.exitCode===0&&!row.errorCode&&!row.signal?'passed':'failed';
  if(!sameCheckout(initial,probe(),profile)){report.blockers.push('Checkout changed during '+step.id);row.status='invalidated';return finish('invalidated');}
  if(row.status!=='passed')return finish('failed');
  save(report);
 }
 return finish('automated-passed');
}
function receiptWriter(root){
 const temp=realpathSync(tmpdir()),rel=relative(realpathSync(root),temp);
 if(!rel||(!rel.startsWith('..')&&!isAbsolute(rel)))throw Error('Evidence directory must be outside the checkout');
 const directory=mkdtempSync(join(temp,'academy-qualification-'));
 const path=join(directory,'receipt.json');
 return {path,save(report){const next=path+'.tmp';writeFileSync(next,JSON.stringify(report,null,2)+'\n',{mode:0o600});renameSync(next,path);}};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
 const root=resolve(dirname(self),'..'),args=process.argv.slice(2),profile=args[0]?.endsWith('-p1')?'p1':args[0]?.endsWith('-release')?'release':'all';
 if(args.length!==1||!['--plan','--run','--plan-p1','--run-p1','--plan-release','--run-release'].includes(args[0])){console.error('Usage: npm run qualify:academy:local -- --plan|--run|--plan-p1|--run-p1|--plan-release|--run-release');process.exitCode=2;}
 else if(args[0]==='--plan'||args[0]==='--plan-p1'||args[0]==='--plan-release'){const report=makeReport(inspectCheckout(root),profile);console.log(JSON.stringify(report,null,2));}
 else{
  try{
   const receipt=receiptWriter(root);
   const report=runQualification({profile,probe:()=>inspectCheckout(root),save:receipt.save,execute:step=>spawnSync(process.execPath,[process.env.npm_execpath,'run',step.script],{cwd:root,stdio:'inherit',timeout:step.timeout,windowsHide:true,shell:false,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}})});
   console.log(JSON.stringify({status:report.status,receipt:receipt.path,publicationApproved:false,blockers:report.blockers},null,2));
   if(report.status!=='automated-passed')process.exitCode=1;
  }catch(error){console.error('Qualification failed; no release approval:',error.message);process.exitCode=1;}
 }
}
