import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Control flow and branching — observed input/output contract",()=>{
  assert.equal(solve(90),'excellent');
  assert.equal(solve(50),'pass');
  assert.equal(solve(49),'retry');
  assert.equal(solve(NaN),'invalid');
  assert.equal(solve(101),'invalid');
});
