import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeBookmarks, discoverPublishedLessons, findSavedLessons
} from '../src/lib/academy/lesson-discovery.ts';

const catalog = [
  { id:'01.01.01', title:'Semantic HTML',moduleId:'01.01',moduleTitle:'HTML Foundations',level:'Beginner',minutes:30,description:'Document tags and accessibility'},
  { id:'01.01.02', title:'Forms and Labels',moduleId:'01.01',moduleTitle:'HTML Foundations',level:'Beginner',minutes:25,description:'Native form elements'},
  { id:'06.01.01', title:'React JSX',moduleId:'06.01',moduleTitle:'React Foundations',level:'Intermediate',minutes:35,description:'React composition'},
  { id:'10.01.01', title:'Node Runtime',moduleId:'10.01',moduleTitle:'Backend Node',level:'Intermediate',minutes:50,description:'Runtime concepts'},
];

test('bookmark normalization retains only published exact-true IDs',() => {
 assert.deepEqual(normalizeBookmarks({
   '01.01.01':true, '01.01.02':false, '99.99.99':true, '__proto__':true,
 },catalog.map(x=>x.id)), { '01.01.01':true });
});

test('normalization ignores inherited keys and absent input',()=>{
 const data=Object.create({'06.01.01':true});
 assert.deepEqual(normalizeBookmarks(data,catalog.map(x=>x.id)),{});
 assert.deepEqual(normalizeBookmarks(undefined,catalog.map(x=>x.id)),{});
});

test('empty query shows published canonical order and is capped by limit',()=>{
 const result=discoverPublishedLessons(catalog,{limit:2});
 assert.equal(result.total,4);
 assert.deepEqual(result.items.map(x=>x.id),['01.01.01','01.01.02']);
});

test('search is case insensitive with AND token matching across fields',()=>{
 const result=discoverPublishedLessons(catalog,{query:'REACT composition'});
 assert.equal(result.total,1);
 assert.equal(result.items[0].id,'06.01.01');
});

test('exact lesson ID ranks before description or module matches',()=>{
 const data=[
  { ...catalog[0],title:'01.01.02 introduction'},
  catalog[1],
 ];
 assert.equal(discoverPublishedLessons(data,{query:'01.01.02'}).items[0].id,'01.01.02');
});

test('filters levels and modules without widening to unplanned content',()=>{
 const result=discoverPublishedLessons(catalog,{moduleId:'01.01',level:'Beginner'});
 assert.equal(result.total,2);
 assert.equal(discoverPublishedLessons(catalog,{moduleId:'09.02'}).total,0);
});

test('pagination returns a stable page and accurate total',()=>{
 const result=discoverPublishedLessons(catalog,{offset:2,limit:1});
 assert.equal(result.total,4);
 assert.deepEqual(result.items.map(x=>x.id),['06.01.01']);
});

test('duplicate published IDs are counted only once',()=>{
 const result=discoverPublishedLessons([...catalog,catalog[1]]);
 assert.equal(result.total,4);
});

test('invalid page bounds are capped without throwing',()=>{
 const empty=discoverPublishedLessons(catalog,{offset:-100,limit:0});
 assert.equal(empty.items.length,1);
 const huge=discoverPublishedLessons(catalog,{offset:Number.POSITIVE_INFINITY,limit:10000});
 assert.equal(huge.items.length,4);
});

test('saved library includes bookmarks or notes and never unknown backup IDs',()=>{
 const progress={
  bookmarks:{'01.01.01':true,'99.99.99':true},
  notes:{'06.01.01':'a note','99.99.99':'untrusted'},
  complete:{'06.01.01':true},
 };
 const rows=findSavedLessons(catalog,progress);
 assert.deepEqual(rows.map(x=>x.id),['01.01.01','06.01.01']);
 assert.equal(rows[1].completed,true);
});

test('blank whitespace-only notes do not count as saved',()=>{
 const result=findSavedLessons(catalog,{notes:{'01.01.01':'  \n  '}});
 assert.deepEqual(result,[]);
});

test('saved library filters bookmarks and notes independently',()=>{
 const state={bookmarks:{'01.01.01':true},notes:{'06.01.01':'draft'}};
 assert.deepEqual(findSavedLessons(catalog,state,'','bookmarked').map(x=>x.id),['01.01.01']);
 assert.deepEqual(findSavedLessons(catalog,state,'','notes').map(x=>x.id),['06.01.01']);
});

test('saved search honors multiple tokens and never searches private note bodies',()=>{
 const state={notes:{'01.01.01':'secret phrase','06.01.01':'draft'}};
 assert.equal(findSavedLessons(catalog,state,'secret').length,0);
 assert.equal(findSavedLessons(catalog,state,'react foundations').length,1);
});

test('saved library deduplicates catalog and preserves canonical order',()=>{
 const state={bookmarks:{'01.01.01':true,'06.01.01':true}};
 const rows=findSavedLessons([...catalog,catalog[0]],state);
 assert.deepEqual(rows.map(x=>x.id),['01.01.01','06.01.01']);
});
