import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {extractFences,matchesExerciseFiles,inspectP4Manuscripts} from '../scripts/verify-source.mjs';
const fence=String.fromCharCode(96).repeat(3);
const article=(lang,a,b)=>fence+lang+'\n'+a+'\n'+fence+'\n'+fence+lang+'\n'+b+'\n'+fence;

test('64 distinct P4 lesson drafts match all eight canonical modules',()=>{
 const result=inspectP4Manuscripts();
 assert.deepEqual(result.issues,[]);
 assert.equal(result.sourceAuthored,64);
 assert.deepEqual(result.moduleCounts.map(x=>x.drafted),[8,8,8,8,8,8,8,8]);
 assert.equal(new Set(result.records.map(x=>x.id)).size,64);
 assert.equal(new Set(result.records.map(x=>x.slug)).size,64);
});
test('P4 manuscripts are not runtime qualified or published',()=>{
 const result=inspectP4Manuscripts();
 assert.equal(result.publishedFromRegistry,result.checkpointPublished);
 assert.equal(result.publishedUnchanged,result.publishedFromRegistry);
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


test('P10 all eight Prisma and Supabase modules retain applied persistence walkthroughs',()=>{
 for(const track of ['13','14'])for(let m=1;m<=4;m++)for(let n=1;n<=8;n++){
  const id=track+'.'+String(m).padStart(2,'0')+'.'+String(n).padStart(2,'0');
  const mdx=readFileSync(new URL('../../../drafts/p4/lessons/'+id+'.mdx',import.meta.url),'utf8').replaceAll('\r\n','\n');
  const walk=mdx.match(/## Applied persistence walkthrough\n([\s\S]*?)(?=## Bug Hunt)/)?.[1]??'';
  assert.ok(walk.trim().split(/\s+/).length>=130,id+' walkthrough missing or shallow');
  for(const marker of ['### Diagnose the concrete failure','### Independent exercise and evidence','**Qualification boundary:**'])assert.ok(walk.includes(marker),id+' missing '+marker);
  assert.equal((mdx.match(/<KnowledgeCheck\b/g)||[]).length,1,id);
  assert.equal((mdx.match(/\x60\x60\x60(\w+)\n[\s\S]*?\n\x60\x60\x60/g)||[]).length,2,id);
  assert.doesNotMatch(mdx,/<LabGate\b/,id);
 }
});
