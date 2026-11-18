import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Setup and strict tsconfig — type contract and runtime boundary",()=>{assert.equal(solve({theme:'light'}),'LIGHT');assert.equal(solve({theme:'bad'}),'INVALID');assert.equal(solve(null),'INVALID');});
