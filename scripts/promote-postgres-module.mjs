/** Local review and apply only. Never commits, deploys or authorizes out-of-order publication. */
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,lstatSync,mkdtempSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {resolve,dirname,join,isAbsolute,basename,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {assertP1Checkout,markP1ReviewFixture} from './p1-publication-review.mjs';
import {buildPersistencePlan} from './persistence-release-plan.mjs';
import {projectSqlModule} from './f9-publication.mjs';
import {runSqlPair,connectionEnvironment} from './persistence-sql-runner.mjs';
import {evidencePath,topicIds,requireOrder,reviewFingerprint,sqlReceipt,validateReview,transactProjection} from './pg-promotion-guard.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),read=p=>readFileSync(join(root,p),'utf8'),json=p=>JSON.parse(read(p)),exists=p=>existsSync(join(root,p));
const encode=o=>JSON.stringify(o,null,2)+'\n';
const [mode,id,...extra]=process.argv.slice(2);assert.ok(!extra.length&&['--plan','--review','--apply'].includes(mode)&&['12.01','12.02'].includes(id),'Usage: npm run promote:postgresql -- --plan|--review|--apply 12.01|12.02');
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const head=assertP1Checkout(root,{reviewOnly:mode==='--review',evidencePath:mode==='--apply'?evidencePath(id):undefined});
const next=JSON.parse(execFileSync(process.execPath,['scripts/publish-academy.mjs','--next'],{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:1024*1024})).next;
const catalog=json('data/curriculum.json'),checkpoint=json('docs/checkpoint.json'),module=buildPersistencePlan(catalog,read).modules.find(m=>m.id===id),projection=projectSqlModule(module,catalog,read,exists);
const fingerprint=()=>reviewFingerprint(git(['ls-files','--stage','-z']),id,projection.fingerprint),sourceSha256=fingerprint();
const blockers=[];let order;try{order=requireOrder(next,id);}catch{blockers.push('Earlier curriculum module must be published first: '+(next?.id??'none'));}
if(!/^v24\.(?:9|[1-9]\d+)\.\d+$/.test(process.version))blockers.push('Node 24.9+ stable required');
const npm=process.env.npm_execpath;if(!npm||!isAbsolute(npm)||basename(npm)!=='npm-cli.js'||!existsSync(npm))blockers.push('Invoke through npm run');
for(const p of ['package-lock.json','examples/forms-query-vertical/react-client/package-lock.json','examples/nestjs-vertical/package-lock.json']){try{assert.ok(lstatSync(join(root,p)).isFile());git(['ls-files','--error-unmatch','--',p]);}catch{blockers.push('Missing tracked lockfile: '+p);}}
try{assert.ok(isAbsolute(process.env.ACADEMY_BROWSER_ROOT??''));createRequire(join(process.env.ACADEMY_BROWSER_ROOT,'package.json')).resolve('playwright');}catch{blockers.push('Installed Playwright required through ACADEMY_BROWSER_ROOT');}
try{connectionEnvironment(process.env.PG_TEST_URL,process.env.ACADEMY_ISOLATED_PG);}catch{blockers.push('Explicit disposable PostgreSQL connection required');}
const psql=spawnSync('psql',['--version'],{encoding:'utf8',timeout:5000,windowsHide:true,shell:false});if(psql.error||psql.status!==0||psql.signal)blockers.push('psql executable required');
const reviewPath=evidencePath(id);if(mode!=='--review'&&!exists(reviewPath))blockers.push('Named per-lesson review evidence missing: '+reviewPath);
console.log(encode({moduleId:id,mode,next:next?.id??null,sourceSha256,projectionSha256:projection.fingerprint,blockers,publicationApproved:false}));
if(mode!=='--plan'){
 assert.deepEqual(blockers,[],'Publication preflight blocked');assert.ok(order);
 const review=mode==='--apply'?validateReview(json(reviewPath),{id,fingerprint:sourceSha256,today:new Date().toISOString().slice(0,10)}):null;
 const run=(...args)=>{console.log('Qualification: npm '+args.join(' '));const result=spawnSync(process.execPath,[npm,...args],{cwd:root,stdio:'inherit',timeout:7200000,windowsHide:true,shell:false,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});assert.ok(result.status===0&&!result.error&&!result.signal,'Qualification failed: '+args.join(' '));};
 run('ci');run('run','checkpoint:check');run('run','test:curriculum-readiness');
 assertP1Checkout(root,{expectedHead:head,reviewOnly:mode==='--review'});assert.equal(fingerprint(),sourceSha256);
 const fixture=Object.keys(module.shared).find(p=>p.endsWith('/fixture.sql'));
 const results=module.topics.map(t=>{const dir='drafts/postgresql/labs/'+t.slug+'/';return runSqlPair({id:t.id,fixture:read(fixture),starter:read(dir+'starter.sql'),solution:read(dir+'solution.sql'),acceptance:read(dir+'acceptance.sql')});});
 const receipt=sqlReceipt(id,sourceSha256,results);if(review)assert.deepEqual(receipt,review.sql,'Current SQL results differ from review receipt');
 assertP1Checkout(root,{expectedHead:head,reviewOnly:mode==='--review'});assert.equal(fingerprint(),sourceSha256);
 const writes=new Map(projection.writes);
 if(review)for(const topic of topicIds(id)){const p='src/content/lessons/'+topic+'.meta.json';writes.set(p,encode({...JSON.parse(writes.get(p)),reviewedAt:review.date}));}
 const file='docs/checkpoint.json',state='postgresql-local-qualified-awaiting-commit';
 writes.set(file,encode(review?{...checkpoint,status:state,development:{...checkpoint.development,state,note:'Local PostgreSQL '+id+'; tracked review '+reviewPath},nextMilestone:'Inspect exact local changes before committing; deployment remains frozen.'}:markP1ReviewFixture(checkpoint,id)));
 const verify=()=>{for(const [p,value] of writes)if(p!==file)assert.equal(read(p),value,'Projection changed: '+p);};
 let output;
 transactProjection(root,writes,()=>{
  verify();run('run','checkpoint:write');const snapshot=json(file).snapshot;assert.equal(snapshot.publishedLessons,order.target);assert.equal(snapshot.authoredMdxLessons,checkpoint.snapshot.authoredMdxLessons+8);assert.equal(snapshot.labFixtures,checkpoint.snapshot.labFixtures+8);assert.ok(snapshot.completeModules.includes(id));const checkpointAfter=read(file);
  run('run','verify:content');run('run','test:curriculum-readiness');run('run','test:postgresql-drafts');run('run','test:postgresql-modeling-source');
  for(const topic of topicIds(id))run('run','lab:postgresql-'+topic.replaceAll('.','-'));
  if(review)run('run','verify:offline');else run('run','build');
  run('run','qualify:postgresql:browser','--',id);
  verify();assert.equal(read(file),checkpointAfter,'Checkpoint drift');assert.equal(fingerprint(),sourceSha256);
  assertP1Checkout(root,{expectedHead:head,reviewOnly:mode==='--review',allowedChanges:writes});
  if(!review){
   const temp=realpathSync(tmpdir()),rel=relative(realpathSync(root),temp);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Review receipt must be outside checkout');output=mkdtempSync(join(temp,'academy-postgresql-review-'));
   try{writeFileSync(join(output,'review.json'),encode({moduleId:id,sourceSha256,publicationApproved:false,date:'',reviewer:'',environment:'',screenReader:'',sql:receipt,lessons:topicIds(id).map(id=>({id,editorial:false,keyboard:false,zoom200:false,screenReader:false,contrast:false,responsive:false,notes:''}))}),{flag:'wx',mode:0o600});}catch(e){rmSync(output,{recursive:true,force:true});throw e;}
  }
 });
 console.log(encode({moduleId:id,status:review?'local-qualified-awaiting-commit':'disposable-review-fixture-do-not-commit',sourceSha256,receiptDirectory:output??null,publicationApproved:!!review,committed:false,deployed:false}));
}
