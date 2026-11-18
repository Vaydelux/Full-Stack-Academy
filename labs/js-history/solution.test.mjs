import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("URL state and History API — runnable logic",()=>{assert.equal(solve('web & css'),'#filter=web%20%26%20css');assert.equal(solve('  api  '),'#filter=api');assert.throws(()=>solve(null),TypeError);});
test('offline HTML includes semantic main and no remote script injection',()=>{assert.match(html,/<main>/);assert.match(html,/<html lang="en">/);assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src=|fetch\s*\(/i);});
