import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lab web API shared contracts monorepo — offline monorepo policy",()=>{assert.deepEqual(solve({id:' A ',qty:3}),{id:'A',qty:3});assert.equal(solve({id:'A',qty:-1}),null);assert.equal(solve(null),null);});
