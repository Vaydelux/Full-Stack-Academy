import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Optional nullable and undefined — type contract and runtime boundary",()=>{assert.equal(solve(0),0);assert.equal(solve(null),10);assert.equal(solve(undefined,8),8);assert.equal(solve(5),5);});
