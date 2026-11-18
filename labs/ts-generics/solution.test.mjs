import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Generics and constraints — type-safe runtime semantics",async()=>{const rows=[{id:'a',score:4},{id:'b',score:9}];assert.deepEqual(solve(rows,'b'),{id:'b',score:9});assert.equal(solve(rows,'none'),undefined);});
