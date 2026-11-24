import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {REQUIRED} from '../scripts/p8-editorial-readiness.mjs';
import {verifyModule} from '../scripts/p8-source-evidence.mjs';
function fixture(){
 const commit='a'.repeat(40), source='Lesson source', contentSha256=createHash('sha256').update(source).digest('hex');
 return {ids:['09.02.01'],commit,sources:{'09.02.01':source},evidence:{'09.02.01':{commit,contentSha256,checks:Object.fromEntries(REQUIRED.map(k=>[k,true])),labPassed:true,negativePassed:true}},receipts:{'09.02.01':{commit,contentSha256,topicId:'09.02.01',positiveExitCode:0,negativeExitCode:1,status:'completed'}}};
}
test('consistent source and receipt remain advisory',()=>{const r=verifyModule(fixture());assert.equal(r.readyForReview,true);assert.equal(r.publicationApproved,false);});
test('edited source invalidates evidence',()=>{const f=fixture();f.sources['09.02.01']+=' changed';assert.equal(verifyModule(f).readyForReview,false);});
test('missing receipt blocks review',()=>{const f=fixture();f.receipts={};assert.equal(verifyModule(f).readyForReview,false);});
for(const [key,value] of Object.entries({commit:'b'.repeat(40),contentSha256:'c'.repeat(64),topicId:'wrong',positiveExitCode:1,negativeExitCode:0,status:'running'}))test('reject mismatched '+key,()=>{const f=fixture();f.receipts['09.02.01'][key]=value;assert.equal(verifyModule(f).readyForReview,false);});
