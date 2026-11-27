/** Combined P1/P2 review-only coordinator. Run only in a fresh detached linked worktree. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { assertP1Checkout, REVIEW_FIXTURE_STATUS, markP1ReviewFixture } from './p1-publication-review.mjs';
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
 assert.equal(process.argv.length,2,'No arguments accepted');
 assert.match(process.version,/^v24\.(?:9|[1-9]\d+)\.\d+$/);
 assert.equal(process.env.ACADEMY_ISOLATED_PG,'YES','Use the isolated PostgreSQL launcher');
 assert.ok(process.env.PG_TEST_URL&&path.isAbsolute(process.env.ACADEMY_BROWSER_ROOT??''),'Missing isolated DB or browser');
 const head=assertP1Checkout(root,{reviewOnly:true});
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
 console.log(JSON.stringify({status:'disposable-review-fixture',commit:head,publishedLessons:386,modules:results,projection:projectionFingerprint(expected),publicationApproved:false,committed:false,deployed:false},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
