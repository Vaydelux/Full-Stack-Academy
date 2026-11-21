import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {renderPublishedQueryArticle} from '../scripts/forms-query-query-release-article.mjs';
import {queryReviewFingerprint} from '../scripts/forms-query-query-review-fingerprint.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ids=Array.from({length:8},(_,i)=>'09.03.'+String(i+1).padStart(2,'0'));
const blocks=s=>[...s.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map(x=>x[1].trim());
test('all eight candidate Query articles project to honest published copy with byte-identical examples',()=>{
 for(const id of ids){
  const slug=JSON.parse(read('drafts/forms-query/lessons/'+id+'.meta.json')).labSlug;
  const src=read('release-candidates/forms-query/09.03/lessons/'+id+'.mdx');
  const published=renderPublishedQueryArticle(src,{id,slug});
  assert.deepEqual(blocks(published),blocks(src));
  assert.equal((published.match(/<LessonStep\b/g)||[]).length,3);
  assert.ok(published.includes('<LabGate lessonId="'+id+'"'));
  assert.ok(published.includes('labs/forms-query-'+slug+'/starter/solution.tsx'));
  assert.ok(published.includes('npm ci --prefix examples/forms-query-vertical/react-client'));
  assert.doesNotMatch(published,/unpublished release candidate|candidate, not published|publication.*remain outstanding/i);
  assert.ok(src.includes('## Guided local lab'),id);
 }
});
test('malformed or duplicate guide marker cannot silently publish',()=>{
 const id='09.03.01',slug='query-keys';
 const src=read('release-candidates/forms-query/09.03/lessons/'+id+'.mdx');
 assert.throws(()=>renderPublishedQueryArticle(src.replace('**Version and deployment scope:**','**Missing scope:**'),{id,slug}),/release marker/);
 assert.throws(()=>renderPublishedQueryArticle(src+'\n**Version and deployment scope:** duplicate',{id,slug}),/release marker/);
 assert.throws(()=>renderPublishedQueryArticle(src,{id,slug:'../bad'}),/Invalid Query/);
});
test('review hash changes when Query teaching or SSR fixture changes',()=>{
 const original=queryReviewFingerprint();
 assert.match(original,/^[a-f0-9]{64}$/);
 assert.equal(queryReviewFingerprint(),original);
 const article='release-candidates/forms-query/09.03/lessons/09.03.01.mdx';
 assert.notEqual(queryReviewFingerprint({readSource:p=>p===article?read(p)+'\nchange':read(p)}),original);
 const ssr='release-candidates/forms-query/09.03/labs/forms-query-ssr-hydration/solution/task-list.tsx';
 assert.notEqual(queryReviewFingerprint({readSource:p=>p===ssr?read(p)+'\nchange':read(p)}),original);
});
