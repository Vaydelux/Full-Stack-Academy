import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Narrowing and type guards — type contract and runtime boundary",()=>{assert.equal(solve({name:'Ada'}),'ADA');assert.equal(solve({name:3}),'UNKNOWN');assert.equal(solve(null),'UNKNOWN');});
