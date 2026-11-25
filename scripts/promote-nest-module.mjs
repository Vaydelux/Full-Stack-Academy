/** Guarded local-only P2 promotion. No automatic Git commit or deployment. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { assertVisibleIndex, validateLessonReviews } from './nest-review-preflight.mjs';
import { projectNestModule } from './nest-release-projection.mjs';
import { projectionFingerprint, verifyProjectionOnDisk } from './forms-query-projection-integrity.mjs';
import { inspectNestJsDrafts } from './verify-nestjs-drafts.mjs';
import { NEST_MODULES, evidencePath, nestPromotionOrder, nestReviewFingerprint, validateNestReview, applyNestTransaction } from './nest-promotion-guard.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const local=p=>path.join(root,p),read=p=>fs.readFileSync(local(p),'utf8'),json=p=>JSON.parse(read(p)),exists=p=>fs.existsSync(local(p));
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024,timeout:30000});
const clean=()=>{assertVisibleIndex(git(['ls-files','-v','-z']));assert.equal(git(['status','--porcelain=v1','--untracked-files=all']),'','Start with a clean tracked and untracked checkout');};
const encode=o=>JSON.stringify(o,null,2)+'\n';
const [mode,id,...extra]=process.argv.slice(2);
assert.ok(!extra.length&&['--plan','--review','--apply'].includes(mode)&&NEST_MODULES.includes(id),'Usage: npm run promote:nestjs -- --plan|--review|--apply 11.01');
clean();assert.equal(fs.realpathSync(git(['rev-parse','--show-toplevel']).trim()),fs.realpathSync(root),'Use the repository root');
const checkpoint=json('docs/checkpoint.json');
let order,orderError;
try{order=nestPromotionOrder(checkpoint.snapshot,id);}catch(error){orderError=error.message;if(mode!=='--plan')throw error;}
const pack=json('release-candidates/nestjs/'+id+'/module.json'),catalog=json('data/curriculum.json');
const audit=inspectNestJsDrafts();assert.deepEqual(audit.issues,[]);
const writes=projectNestModule(pack,catalog,read,exists);
const digest=projectionFingerprint(writes).sha256;
const fingerprint=()=>nestReviewFingerprint(git(['ls-files','--stage','-z']),digest,id);
const sourceSha256=fingerprint(),lessonIds=pack.candidates.map(c=>c.id),head=git(['rev-parse','HEAD']).trim();
const evidence=evidencePath(id);
const blockers=[orderError,...['package-lock.json','examples/nestjs-vertical/package-lock.json'].filter(p=>!exists(p)).map(p=>'Missing genuine lock: '+p),...(!exists(evidence)?['Named accessibility evidence missing']:[])].filter(Boolean);
const plan={moduleId:id,...(order??{before:checkpoint.snapshot.publishedLessons,target:null}),lessonIds,sourceSha256,projectionSha256:digest,reviewEvidence:evidence,blockers,publicationApproved:false};
console.log(JSON.stringify(plan,null,2));
if(mode!=='--plan'){
 assert.ok(/^v24\.(?:9|[1-9]\d+)\.\d+$/.test(process.version),'Node 24.9+ stable required');
 const npm=process.env.npm_execpath;
 assert.ok(typeof npm==='string'&&path.isAbsolute(npm)&&path.basename(npm)==='npm-cli.js'&&fs.existsSync(npm),'Invoke via npm run');
 assert.ok(path.isAbsolute(process.env.ACADEMY_BROWSER_ROOT??''),'Install Playwright in an absolute ACADEMY_BROWSER_ROOT');
 createRequire(path.join(process.env.ACADEMY_BROWSER_ROOT,'package.json')).resolve('playwright');
 const locks=['package-lock.json','examples/nestjs-vertical/package-lock.json'];
 for(const lock of locks){assert.ok(exists(lock),'Missing genuine lock: '+lock);git(['ls-files','--error-unmatch',lock]);}
 const run=(...args)=>{
  console.log('Qualification: npm '+args.join(' '));
  const result=spawnSync(process.execPath,[npm,...args],{cwd:root,stdio:'inherit',timeout:7_200_000,windowsHide:true,shell:false});
  assert.ok(result.status===0&&!result.error&&!result.signal,'Qualification failed: '+args.join(' '));
 };
 let review;
 if(mode==='--review'){
  // Only a disposable detached linked worktree; never stage fixture review dates on main.
  assert.equal(git(['rev-parse','--abbrev-ref','HEAD']).trim(),'HEAD','Review requires a detached worktree');
  assert.ok(fs.statSync(local('.git')).isFile(),'Review requires a linked disposable worktree');
 }else{
  assertVisibleIndex(git(['ls-files','-v','-z']),evidence);
  assert.ok(fs.lstatSync(local(evidence)).isFile(),'Review evidence must be a regular file');
  review=validateNestReview(json(evidence),{id,fingerprint:sourceSha256,lessonIds,today:new Date().toISOString().slice(0,10)});
  validateLessonReviews(review,lessonIds);
 }
 run('ci');run('run','checkpoint:check');run('run','test:curriculum-readiness');
 run('run','qualify:nestjs:module','--','--run',id);
 clean();assert.equal(git(['rev-parse','HEAD']).trim(),head);assert.equal(fingerprint(),sourceSha256);
 if(review)for(const lessonId of lessonIds){const file='src/content/lessons/'+lessonId+'.meta.json';writes.set(file,encode({...JSON.parse(writes.get(file)),reviewedAt:review.date}));}
 const checkpointFile='docs/checkpoint.json';
 const state=mode==='--review'?'LOCAL-REVIEW-FIXTURE-DO-NOT-COMMIT':'p2-local-publication-qualified-awaiting-commit';
 writes.set(checkpointFile,encode({...checkpoint,status:state,development:{...checkpoint.development,state,note:'Local Nest '+id+'; '+(review?'review evidence '+evidence:'disposable review fixture only, no approval')},nextMilestone:'Review the exact local changes before any commit or deployment.'}));
 const io={exists,read,write:(p,s)=>{fs.mkdirSync(path.dirname(local(p)),{recursive:true});fs.writeFileSync(local(p),s);},remove:p=>fs.rmSync(local(p),{force:true})};
 applyNestTransaction(writes,io,()=>{
  // Check the projection before checkpoint regeneration, then use the actual source-derived checkpoint.
  verifyProjectionOnDisk(writes,read);
  run('run','checkpoint:write');
  const snapshot=json(checkpointFile).snapshot;
  assert.equal(snapshot.publishedLessons,order.target);assert.ok(snapshot.completeModules.includes(id));
  const expectedCheckpoint=read(checkpointFile);
  if(mode==='--review'){run('run','verify:content');run('run','build');}
  else run('run','verify:offline');
  run('run','qualify:nestjs:browser','--',id);
  verifyProjectionOnDisk(new Map([...writes].filter(([file])=>file!==checkpointFile)),read);
  assert.equal(read(checkpointFile),expectedCheckpoint,'Checkpoint changed during postflight');
  assert.equal(git(['rev-parse','HEAD']).trim(),head);assert.equal(fingerprint(),sourceSha256,'Tracked index changed');
  const changed=git(['status','--porcelain=v1','-z','--untracked-files=all']).split('\0').filter(Boolean);
  for(const entry of changed)assert.ok(/^( M|\?\?) /.test(entry)&&writes.has(entry.slice(3)),'Unexpected worktree change: '+entry);
 });
 console.log(JSON.stringify({moduleId:id,status:mode==='--review'?'disposable-review-fixture':'local-qualified-awaiting-commit',sourceSha256,publicationApproved:mode==='--apply',committed:false,deployed:false},null,2));
}
