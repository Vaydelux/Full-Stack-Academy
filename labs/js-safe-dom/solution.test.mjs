import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Security of innerHTML — runnable logic",()=>{assert.equal(solve('<img src=x onerror=alert(1)>'),'<img src=x onerror=alert(1)>');assert.throws(()=>solve(null),TypeError);});
test('offline HTML includes semantic main and no remote script injection',()=>{assert.match(html,/<main>/);assert.match(html,/<html lang="en">/);assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src=|fetch\s*\(/i);});
