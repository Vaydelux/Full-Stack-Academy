import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Conditional types and infer — type-safe runtime semantics",async()=>{assert.equal(await solve(Promise.resolve(8)),8);assert.equal(await solve('hello'),'hello');});
