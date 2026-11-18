import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Functions and closures — observed input/output contract",()=>{
  const a=solve(2),b=solve(10);
  assert.equal(a.increment(),3);
  assert.equal(b.value(),10);
  assert.equal(b.increment(),11);
  assert.equal(a.value(),3);
  assert.throws(()=>solve(1.5),TypeError);
});
