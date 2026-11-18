import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("LocalStorage and IndexedDB — runnable logic",()=>{assert.deepEqual(solve(' memo '),{key:'academy-note',value:'memo'});assert.throws(()=>solve('x'.repeat(201)),TypeError);assert.throws(()=>solve(null),TypeError);});
test('offline HTML includes semantic main and no remote script injection',()=>{assert.match(html,/<main>/);assert.match(html,/<html lang="en">/);assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src=|fetch\s*\(/i);});
