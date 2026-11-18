import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Iterators and generators semantics and regression cases",async()=>{
  assert.deepEqual([...solve(0,5,2)],[0,2,4]);assert.deepEqual([...solve(5,0,-2)],[5,3,1]);assert.deepEqual([...solve(2,2)],[]);assert.throws(()=>[...solve(0,2,0)],RangeError);
});
