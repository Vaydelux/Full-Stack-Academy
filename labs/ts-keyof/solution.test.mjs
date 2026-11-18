import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("keyof indexed access and typeof — type-safe runtime semantics",async()=>{const v={id:'x',count:7};assert.equal(solve(v,'count'),7);assert.equal(solve(v,'id'),'x');});
