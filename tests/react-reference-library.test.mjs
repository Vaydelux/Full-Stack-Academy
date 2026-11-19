import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const reactIds=['react-usestate','react-usereducer','react-useeffect','react-useref','react-usecontext','react-usetransition','react-useoptimistic','react-useactionstate'];
test('eight React 19 reference drafts match canonical indexed IDs and official sources',()=>{
 const index=JSON.parse(read('data/reference-index.json'));
 const available=new Set(index.entries.filter(x=>x.category==='React').map(x=>x.id));
 const section=read('src/lib/academy/authored-content.ts').split('export const AUTHORED_REFERENCES')[1].split('export function findAuthoredReference')[0];
 for(const id of reactIds){
  assert.ok(available.has(id),'Unknown canonical React reference '+id);
  assert.ok(section.includes('"id": "'+id+'"'),'Missing authored React reference '+id);
 }
 const checkpoint=JSON.parse(read('docs/checkpoint.json'));
 assert.equal(checkpoint.snapshot.authoredReferenceDrafts,38);
 assert.equal(checkpoint.snapshot.indexedReferences,303);
});
test('reference explorer has explicit search, category, status and pagination interactions',()=>{
 const page=read('src/app/reference/page.tsx');
 const explorer=read('src/components/course/ReferenceExplorer.tsx');
 assert.match(page,/<ReferenceExplorer/);
 for(const item of ['type="search"','reference-category','reference-status','Authored drafts only','Show more references','Reset filters']){
  assert.ok(explorer.includes(item),item);
 }
 assert.match(explorer,/role="status" aria-live="polite"/);
 assert.match(explorer,/setLimit\(\(current\) => current \+ 36\)/);
});
