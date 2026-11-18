import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Functions and overloads — type contract and runtime boundary",()=>{assert.equal(solve(2),'2.00');assert.equal(solve('  hi  '),'hi');assert.equal(solve(3.75),'3.75');});
