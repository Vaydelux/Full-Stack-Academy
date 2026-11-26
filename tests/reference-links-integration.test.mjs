import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AUTHORED_REFERENCES} from '../src/lib/academy/authored-content.ts';
import {buildReferenceLinks,relatedReferences,relatedCurriculum} from '../scripts/reference-links.mjs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('actual authored references have valid reversible curriculum edges',()=>{
 const entries=json('data/reference-index.json').entries, lessons=json('data/curriculum.json').lessons;
 const graph=buildReferenceLinks(entries,AUTHORED_REFERENCES,lessons);
 for(const ref of AUTHORED_REFERENCES){
   const linked=relatedCurriculum(graph,lessons,ref.id);
   assert.ok(linked.length,ref.id);
   for(const lesson of linked)assert.ok(relatedReferences(graph,entries,lesson.id).some(x=>x.id===ref.id&&x.authored),ref.id+' '+lesson.id);
 }
 assert.equal(AUTHORED_REFERENCES.length,json('docs/checkpoint.json').snapshot.authoredReferenceDrafts);
});
