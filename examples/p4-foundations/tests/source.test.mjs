import test from 'node:test';
import assert from 'node:assert/strict';
import {extractFences,matchesExerciseFiles,inspectP4Manuscripts} from '../scripts/verify-source.mjs';
const fence=String.fromCharCode(96).repeat(3);
const article=(lang,a,b)=>fence+lang+'\n'+a+'\n'+fence+'\n'+fence+lang+'\n'+b+'\n'+fence;

test('40 distinct P4 lesson drafts match the five canonical modules',()=>{
 const result=inspectP4Manuscripts();
 assert.deepEqual(result.issues,[]);
 assert.equal(result.sourceAuthored,40);
 assert.deepEqual(result.moduleCounts.map(x=>x.drafted),[8,8,8,8,8]);
 assert.equal(new Set(result.records.map(x=>x.id)).size,40);
 assert.equal(new Set(result.records.map(x=>x.slug)).size,40);
});
test('P4 manuscripts are not runtime qualified or published',()=>{
 const result=inspectP4Manuscripts();
 assert.equal(result.publishedUnchanged,338);
 assert.equal(result.readyToPublish,false);
 assert.equal(result.realIntegrationExecuted,false);
 assert.ok(result.records.every(x=>x.status==='draft-unverified'));
});
test('mixed-language code snippets must exactly match their exercise sources',()=>{
 for(const lang of ['ts','sql','bash','prisma']){
  assert.deepEqual(extractFences(article(lang,'bad','good'),lang),['bad','good']);
  assert.equal(matchesExerciseFiles(article(lang,'bad','good'),lang,'bad','good'),true);
  assert.equal(matchesExerciseFiles(article(lang,'bad','good'),lang,'bad','wrong'),false);
  assert.equal(matchesExerciseFiles(article(lang,'bad','good'),lang,'other','good'),false);
 }
});
test('missing or extra snippet blocks never pass',()=>{
 assert.equal(matchesExerciseFiles(fence+'ts\nx\n'+fence,'ts','x','y'),false);
 assert.equal(matchesExerciseFiles(article('sql','a','b')+'\n'+fence+'sql\nc\n'+fence,'sql','a','b'),false);
});
test('unknown source code fence languages are rejected',()=>{
 assert.throws(()=>extractFences(article('text','a','b'),'html'),/Unsupported/);
});
