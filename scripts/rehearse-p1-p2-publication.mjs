/** Combined P1/P2 review-only coordinator. Run only in a fresh detached linked worktree. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { assertP1Checkout, REVIEW_FIXTURE_STATUS, markP1ReviewFixture } from './p1-publication-review.mjs';
import { buildPersistencePlan } from './persistence-release-plan.mjs';
import { projectSqlModule } from './f9-publication.mjs';
import { requireOrder } from './pg-promotion-guard.mjs';
import { nestLabEnvironment } from './pg-lab-policy.mjs';
import { rehearseP3Source } from './p3-source-rehearsal.mjs';
import { projectNestModule, registryPaths } from './nest-release-projection.mjs';
import { inspectNestJsDrafts } from './verify-nestjs-drafts.mjs';
import { nestPromotionOrder, NEST_MODULES } from './nest-promotion-guard.mjs';
import { projectionFingerprint, verifyProjectionOnDisk } from './forms-query-projection-integrity.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const checkpointPath='docs/checkpoint.json';
const local=p=>path.join(root,p);
const read=p=>fs.readFileSync(local(p),'utf8');
const json=p=>JSON.parse(read(p));
const exists=p=>fs.existsSync(local(p));
const write=(p,s)=>{fs.mkdirSync(path.dirname(local(p)),{recursive:true});fs.writeFileSync(local(p),s);};
const encode=o=>JSON.stringify(o,null,2)+'\n';
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:32*1024*1024});
const run=(...args)=>execFileSync('npm',args,{cwd:root,stdio:'inherit',timeout:7_200_000});
const browser=(...args)=>execFileSync(process.execPath,['scripts/verify-academy-browser.mjs',...args],{cwd:root,stdio:'inherit',timeout:600_000});
function fixture(count,modules){
 const cp=json(checkpointPath);
 assert.equal(cp.status,REVIEW_FIXTURE_STATUS);
 assert.equal(cp.development.state,REVIEW_FIXTURE_STATUS);
 assert.equal(cp.snapshot.publishedLessons,count);
 for(const id of modules)assert.ok(cp.snapshot.completeModules.includes(id),'Missing complete module '+id);
 return cp;
}
function changedPaths(){
 return git(['status','--porcelain=v1','-z','--untracked-files=all']).split('\0').filter(Boolean).map(entry=>{
  assert.ok(/^( M|\?\?) /.test(entry),'Unexpected status '+entry);
  return entry.slice(3);
 });
}
/** New projections may replace only the three shared registries, never a predecessor's lab or lesson. */
export function combineExpected(previous,next){
 const merged=new Map(previous);
 for(const [file,content] of next){
  assert.ok(!merged.has(file)||registryPaths.includes(file),'Unexpected predecessor overwrite: '+file);
  merged.set(file,content);
 }
 return merged;
}
function main(){
 const p3Live=process.argv[2]==='--through-p3-sql';
 assert.ok(process.argv.length===2||process.argv.length===3&&p3Live,'Usage: [--through-p3-sql]');
 if(p3Live){nestLabEnvironment(process.env,true);assert.equal(process.env.ACADEMY_DISTRIBUTED_PG_ISOLATED,'YES');assert.ok(process.env.ACADEMY_DISTRIBUTED_PG_URL);}
 assert.match(process.version,/^v24\.(?:9|[1-9]\d+)\.\d+$/);
 assert.equal(process.env.ACADEMY_ISOLATED_PG,'YES','Use the isolated PostgreSQL launcher');
 assert.ok(process.env.PG_TEST_URL&&path.isAbsolute(process.env.ACADEMY_BROWSER_ROOT??''),'Missing isolated DB or browser');
 const head=assertP1Checkout(root,{reviewOnly:true});
 const index=git(['ls-files','--stage','-z']);
 assert.equal(json(checkpointPath).snapshot.publishedLessons,338);
 run('run','promote:forms-query:rhf','--','--plan');
 run('run','promote:forms-query:rhf','--','--simulate');
 run('run','promote:forms-query:query','--','--simulate');
 run('run','promote:forms-query:rhf','--','--review');
 fixture(346,['09.02']);
 // Capture the exact outputs immediately after the guarded RHF command.
 // Never bless changes made by subsequent regression or browser commands.
 const capture=count=>{
  const paths=changedPaths();
  assert.equal(paths.length,count+1,'Unexpected P1 file inventory');
  assert.ok(paths.includes(checkpointPath));
  return new Map(paths.filter(p=>p!==checkpointPath).map(p=>[p,read(p)]));
 };
 let expected=capture(50);
 let checkpointBytes=read(checkpointPath);
 const verify=()=>{
  assertP1Checkout(root,{reviewOnly:true,expectedHead:head,allowedChanges:new Set([...expected.keys(),checkpointPath])});
  assert.equal(git(['ls-files','--stage','-z']),index,'Git index changed');
  verifyProjectionOnDisk(expected,read);
  assert.equal(read(checkpointPath),checkpointBytes,'Checkpoint changed unexpectedly');
 };
 verify();
 run('run','verify:offline');verify();browser();verify();
 run('run','promote:forms-query:query','--','--review');
 fixture(354,['09.02','09.03']);
 const combined=capture(102);
 // Query may replace the shared registries only.
 verifyProjectionOnDisk(new Map([...expected].filter(([file])=>!registryPaths.includes(file))),read);
 expected=combined;checkpointBytes=read(checkpointPath);
 verify();
 run('run','verify:offline');verify();browser();verify();
 run('ci','--prefix','examples/nestjs-vertical');
 verify();
 const catalog=json('data/curriculum.json'),results=[];
 for(const id of NEST_MODULES){
  verify();
  const order=nestPromotionOrder(json(checkpointPath).snapshot,id);
  const pack=json('release-candidates/nestjs/'+id+'/module.json');
  const projection=projectNestModule(pack,catalog,read,exists);
  const merged=combineExpected(expected,projection);
  for(const [file,content] of projection)write(file,content);
  write(checkpointPath,encode(markP1ReviewFixture(json(checkpointPath),id)));
  run('run','checkpoint:write');
  fixture(order.target,['09.02','09.03',...NEST_MODULES.slice(0,NEST_MODULES.indexOf(id)+1)]);
  assert.deepEqual(inspectNestJsDrafts().issues,[]);
  expected=merged;checkpointBytes=read(checkpointPath);
  verify();
  const receipt={moduleId:id,publishedLessons:order.target,...projectionFingerprint(projection)};
  results.push(receipt);console.log(JSON.stringify(receipt));
 }
 assert.equal(expected.size,295,'Expected 102 P1 and 193 additional Nest files');
 fixture(386,['09.02','09.03',...NEST_MODULES]);
 // Full offline gate includes all published instructor wrappers, including real
 // PostgreSQL and Socket.IO acceptance; do not replace it with source checks.
 run('run','verify:offline');verify();
 browser();verify();
 for(const id of NEST_MODULES){browser('--nest-module',id);verify();}
 execFileSync(process.execPath,['--test','tests/p3-source-rehearsal.test.mjs'],{cwd:root,stdio:'inherit',timeout:60000});verify();
 const p3=rehearseP3Source({checkpoint:json(checkpointPath),catalog,read,exists});verify();
 console.log(JSON.stringify(p3,null,2));
 console.log(JSON.stringify({status:'disposable-review-fixture',commit:head,publishedLessons:386,modules:results,projection:projectionFingerprint(expected),publicationApproved:false,committed:false,deployed:false},null,2));
 if(p3Live){
  run('ci','--prefix','examples/p5-distributed-runtime');verify();
  const modules=buildPersistencePlan(catalog,read).modules,sqlIds=['12.01','12.02','12.03'],sqlResults=[];
  for(const [i,id] of sqlIds.entries()){
   verify();
   const next=JSON.parse(execFileSync(process.execPath,['scripts/publish-academy.mjs','--next'],{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:1024*1024})).next;
   const order=requireOrder(next,id);
   const projection=projectSqlModule(modules.find(m=>m.id===id),catalog,read,exists);
   assert.equal(projection.publicationApproved,false);
   const merged=combineExpected(expected,projection.writes);
   for(const [file,body] of projection.writes)write(file,body);
   write(checkpointPath,encode(markP1ReviewFixture(json(checkpointPath),id)));
   run('run','checkpoint:write');
   fixture(order.target,['09.02','09.03',...NEST_MODULES,...sqlIds.slice(0,i+1)]);
   expected=merged;checkpointBytes=read(checkpointPath);verify();
   sqlResults.push({moduleId:id,publishedLessons:order.target,projectionSha256:projection.fingerprint});
  }
  assert.equal(expected.size,463);
  fixture(410,['09.02','09.03',...NEST_MODULES,...sqlIds]);
  for(const id of ['12.04','12.05'])for(let i=1;i<=8;i++)assert.ok(!exists('src/content/lessons/'+id+'.0'+i+'.mdx'),'Mixed overlay must never be written');
  // Executes every projected SQL and Nest instructor wrapper, including separate real concurrency.
  run('run','verify:offline');verify();
  browser();verify();
  for(const id of sqlIds){browser('--postgres-module',id);verify();}
  console.log(JSON.stringify({status:'disposable-review-fixture',commit:head,publishedLessons:410,modules:sqlResults,projection:projectionFingerprint(expected),publicationApproved:false,committed:false,deployed:false},null,2));
 }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
