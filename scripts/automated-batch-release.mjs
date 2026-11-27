/** Batch release candidate: only after the exact detached runtime/browser fixture passed. */
import assert from 'node:assert/strict';
import {writeFileSync,realpathSync,existsSync} from 'node:fs';
import {join,relative,isAbsolute,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {projectionFingerprint,verifyProjectionOnDisk} from './forms-query-projection-integrity.mjs';
import {assertP1Checkout,REVIEW_FIXTURE_STATUS} from './p1-publication-review.mjs';
export const batchModules=Object.freeze(['09.02','09.03','11.01','11.02','11.03','11.04','12.01','12.02','12.03']);
export const batchIds=Object.freeze(batchModules.flatMap(m=>Array.from({length:8},(_,i)=>m+'.0'+(i+1))));
export const receiptPath='docs/release-evidence/automated-batch-01.json';
const encode=o=>JSON.stringify(o,null,2)+'\n';
export function qualifyMetadata(meta,date,id){
 assert.equal(meta.id,id);assert.ok(batchIds.includes(id));
 assert.equal(meta.reviewedAt,'2000-01-01');assert.equal(meta.automatedQualifiedAt,undefined);
 assert.match(date,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(date).toISOString().slice(0,10),date);assert.ok(date>'2000-01-01');
 return {...meta,reviewedAt:null,automatedQualifiedAt:date};
}
export function prepareAutomatedRelease({root,head,expected,checkpoint,read,write,git,run,browser,verify,checkpointPath}){
 assert.equal(process.env.GITHUB_ACTIONS,'true');
 assert.equal(process.env.ACADEMY_AUTOMATED_BATCH,'YES');
 assert.equal(checkpoint.status,REVIEW_FIXTURE_STATUS);
 assert.equal(checkpoint.snapshot.publishedLessons,410);
 assert.equal(expected.size,463);
 verify();
 const out=realpathSync(process.env.ACADEMY_BATCH_OUTPUT);
 const rel=relative(realpathSync(root),out);assert.ok(isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep),'Use an external artifact directory');
 assert.ok(!existsSync(join(out,'batch.patch'))&&!existsSync(join(out,'receipt.json')));
 const date=new Date().toISOString().slice(0,10),files=new Map(expected),fixture=projectionFingerprint(expected);
 for(const id of batchIds){
  const p='src/content/lessons/'+id+'.meta.json';
  assert.ok(files.has(p));
  const body=encode(qualifyMetadata(JSON.parse(files.get(p)),date,id));
  files.set(p,body);write(p,body);
 }
 const projection=projectionFingerprint(files);
 const receipt={schemaVersion:1,policy:'automated-qualified-human-review-pending',sourceCommit:head,qualificationDate:date,baseline:338,target:410,modules:batchModules,lessonIds:batchIds,fixture,projection,automatedRuntimePassed:true,humanEditorialReviewed:false,humanAccessibilityReviewed:false,productionDeployed:false};
 write(receiptPath,encode(receipt));files.set(receiptPath,encode(receipt));
 const record={...checkpoint,status:'automated-qualified-release-candidate',development:{...checkpoint.development,state:'automated-qualified-72-lesson-batch',note:'72 new lessons passed automated runtime/build/browser qualification. Independent human editorial and accessibility review pending. Not deployed.'},nextMilestone:'Review and integrate the exact automated-qualified 410-lesson candidate; continue remaining 80 persistence topics.'};
 write(checkpointPath,encode(record));files.set(checkpointPath,encode(record));
 const check=()=>{assertP1Checkout(root,{reviewOnly:true,expectedHead:head,allowedChanges:new Set(files.keys())});verifyProjectionOnDisk(files,read);};
 check();run('run','verify:offline');check();browser();check();
 for(const id of batchModules.filter(m=>m.startsWith('11.'))) {browser('--nest-module',id);check();}
 for(const id of batchModules.filter(m=>m.startsWith('12.'))) {browser('--postgres-module',id);check();}
 // Only the exact postflight-verified candidate is staged in this disposable checkout.
 const paths=[...files.keys()].sort();assert.equal(paths.length,465);
 git(['add','--',...paths]);
 const actual=git(['diff','--cached','--name-only','-z']).split('\0').filter(Boolean).sort();
 assert.deepEqual(actual,paths);
 const patch=git(['diff','--cached','--binary','--no-ext-diff','--full-index']);
 assert.ok(patch.length>0);
 writeFileSync(join(out,'batch.patch'),patch,{flag:'wx'});
 writeFileSync(join(out,'receipt.json'),encode({...receipt,patchSha256:createHash('sha256').update(patch).digest('hex'),changedPaths:paths}),{flag:'wx'});
 return {status:'automated-qualified-release-candidate-exported',target:410,files:paths.length,publicationApproved:false,productionDeployed:false};
}
