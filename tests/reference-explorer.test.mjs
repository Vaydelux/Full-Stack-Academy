import test from 'node:test';
import assert from 'node:assert/strict';
import {filterReferenceEntries,groupReferenceEntries} from '../src/lib/academy/reference-filter.ts';

const entries=[
 {id:'react-usestate',category:'React',title:'useState',slug:'usestate',authored:true},
 {id:'react-useeffect',category:'React',title:'useEffect',slug:'useeffect',authored:true},
 {id:'next.js-use-cache',category:'Next.js',title:'use cache',slug:'use-cache',authored:true},
 {id:'react-key',category:'React',title:'key',slug:'key',authored:false}
];

test('reference search matches case insensitive public titles',()=>{
 assert.deepEqual(filterReferenceEntries(entries,{query:'  USEEFFECT ',category:'all',authoredOnly:false}).map(x=>x.id),['react-useeffect']);
 assert.deepEqual(filterReferenceEntries(entries,{query:'cache',category:'all',authoredOnly:false}).map(x=>x.id),['next.js-use-cache']);
});
test('combined category and detailed-only filters are precise',()=>{
 assert.deepEqual(filterReferenceEntries(entries,{query:'',category:'React',authoredOnly:true}).map(x=>x.id),['react-usestate','react-useeffect']);
 assert.deepEqual(filterReferenceEntries(entries,{query:'key',category:'React',authoredOnly:true}),[]);
});
test('unfiltered collection and ordering are stable',()=>{
 const out=filterReferenceEntries(entries,{query:'',category:'all',authoredOnly:false});
 assert.equal(out.length,4);
 assert.equal(entries[0].id,'react-usestate');
 assert.deepEqual(groupReferenceEntries(out).map(x=>x.category),['React','Next.js']);
});
