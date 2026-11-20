import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPublishedRHFArticle} from '../scripts/forms-query-release-article.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=Array.from({length:8},(_,i)=>'09.02.'+String(i+1).padStart(2,'0'));
const fence=new RegExp(String.fromCharCode(96).repeat(3)+'tsx\\n([\\s\\S]*?)\\n'+String.fromCharCode(96).repeat(3),'g');
const fences=source=>[...source.matchAll(fence)].map(m=>m[1]);
test('all eight published RHF articles have live instructions without changing their code',()=>{
 for(const id of ids){
  const candidate=read('release-candidates/forms-query/09.02/lessons/'+id+'.mdx');
  const slug=JSON.parse(read('drafts/forms-query/lessons/'+id+'.meta.json')).labSlug;
  const published=renderPublishedRHFArticle(candidate,{id,slug});
  assert.doesNotMatch(published,/This staged article|this candidate|not published|remain outstanding|before promoting this draft|before publication|staged exercise/i,id);
  assert.ok(published.includes('npm ci --prefix examples/forms-query-vertical/react-client'));
  assert.ok(published.includes('labs/forms-query-'+slug+'/'));
  assert.ok(published.includes('labId="lab.react.forms-query-'+slug+'"'));
  assert.deepEqual(fences(published),fences(candidate),id+' changed instructor/starter TSX');
  assert.equal((published.match(/<LessonStep\\b/g)||[]).length,3);
  assert.equal((published.match(/<KnowledgeCheck\\b/g)||[]).length,1);
  assert.equal((published.match(/<LabGate\\b/g)||[]).length,1);
  assert.ok(candidate.includes('This candidate is **not published**'),id+' original draft was unexpectedly edited');
 }
});
test('missing or duplicate release markers fail closed',()=>{
 const id='09.02.01',slug='controlled-uncontrolled';
 const candidate=read('release-candidates/forms-query/09.02/lessons/'+id+'.mdx');
 assert.throws(()=>renderPublishedRHFArticle(candidate.replace('**Scope:** This staged article','**Scope:** Removed marker'),{id,slug}),/release marker/);
 assert.throws(()=>renderPublishedRHFArticle(candidate+'\\n**Scope:** This staged article duplicate',{id,slug}),/release marker/);
 assert.throws(()=>renderPublishedRHFArticle(candidate,{id,slug:'../outside'}),/slug/);
});
test('screen-reader guidance remains applicable after release',()=>{
 const id='09.02.07',slug='server-error-focus';
 const candidate=read('release-candidates/forms-query/09.02/lessons/'+id+'.mdx');
 const published=renderPublishedRHFArticle(candidate,{id,slug});
 assert.match(published,/test error announcements and focus recovery with a real screen reader and keyboard/);
 assert.doesNotMatch(published,/before publication/);
});
