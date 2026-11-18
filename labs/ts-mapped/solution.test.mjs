import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Mapped types and safe patches — type-safe runtime semantics",async()=>{const original={id:'a',count:1};const next=solve(original,{count:2});assert.deepEqual(next,{id:'a',count:2});assert.equal(original.count,1);assert.notEqual(next,original);});
