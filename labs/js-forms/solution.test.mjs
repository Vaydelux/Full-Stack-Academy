import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Forms and validation — runnable logic",()=>{assert.equal(solve('Ada'),true);assert.equal(solve('   '),false);assert.equal(solve('A'),false);assert.equal(solve(null),false);});
test('offline HTML includes semantic main and no remote script injection',()=>{assert.match(html,/<main>/);assert.match(html,/<html lang="en">/);assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src=|fetch\s*\(/i);});
