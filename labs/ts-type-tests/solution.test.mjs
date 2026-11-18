import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Type testing with tsd-style assertions — validated runtime boundary",()=>{assert.equal(solve([1,2]),1);assert.equal(solve(['a','b']),'a');assert.equal(solve([]),undefined);});
