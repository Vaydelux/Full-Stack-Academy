import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Discriminated unions and exhaustiveness — type-safe runtime semantics",async()=>{assert.equal(solve(4,{kind:'add',amount:2}),6);assert.equal(solve(4,{kind:'remove',amount:2}),2);assert.throws(()=>solve(1,{kind:'remove',amount:5}),RangeError);});
