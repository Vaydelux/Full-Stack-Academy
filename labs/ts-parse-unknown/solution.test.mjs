import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Parsing unknown data with Zod — validated runtime boundary",()=>{assert.deepEqual(solve({id:'a',qty:2}),{id:'a',qty:2});assert.equal(solve({id:'a',qty:-1}),null);assert.equal(solve({id:'a',qty:2,admin:true}),null);assert.equal(solve(null),null);});
