import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReferenceLinks, relatedReferences, relatedCurriculum } from '../scripts/reference-links.mjs';
const entries=[{id:'a',lessonCrossReferences:['l1','l1']},{id:'b',lessonCrossReferences:[]},{id:'c',lessonCrossReferences:['l3']}];
const authored=[{id:'a',relatedLessonIds:['l2','l1']},{id:'b',relatedLessonIds:['l2']}];
const lessons=[{id:'l1',access:'published'},{id:'l2',access:'reading'},{id:'l3',access:'planned'}];
const graph=()=>buildReferenceLinks(entries,authored,lessons);
test('merges explicit index and authored edges without duplicates',()=>{
 const g=graph();assert.deepEqual([...g.byReference.get('a')],['l1','l2']);assert.deepEqual([...g.byLesson.get('l2')],['a','b']);
});
test('bidirectional links retain canonical order and original access status',()=>{
 const g=graph();assert.deepEqual(relatedCurriculum(g,lessons,'a'),lessons.slice(0,2));
 assert.deepEqual(relatedReferences(g,entries,'l2').map(x=>[x.id,x.authored]),[['a',true],['b',true]]);
 assert.deepEqual(relatedReferences(g,entries,'l3').map(x=>[x.id,x.authored]),[['c',false]]);
});
test('unlinked and unknown lookup IDs return empty results',()=>{assert.deepEqual(relatedReferences(graph(),entries,'unknown'),[]);assert.deepEqual(relatedCurriculum(graph(),lessons,'unknown'),[]);});
test('unknown link targets and duplicate identifiers fail closed',()=>{
 assert.throws(()=>buildReferenceLinks(entries,[{id:'missing',relatedLessonIds:[]}],lessons),/Unknown reference/);
 assert.throws(()=>buildReferenceLinks(entries,[{id:'a',relatedLessonIds:['missing']}],lessons),/Unknown linked lesson/);
 assert.throws(()=>buildReferenceLinks([...entries,entries[0]],authored,lessons),/Duplicate/);
 assert.throws(()=>buildReferenceLinks(entries,[...authored,authored[0]],lessons),/Duplicate/);
 assert.throws(()=>buildReferenceLinks(entries,authored,[...lessons,lessons[0]]),/Duplicate/);
});
test('graph construction leaves source arrays intact',()=>{const before=JSON.stringify([entries,authored,lessons]);graph();assert.equal(JSON.stringify([entries,authored,lessons]),before);});
