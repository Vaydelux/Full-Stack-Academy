import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Equality and truthiness — observed input/output contract",()=>{
  assert.equal(solve(true),true);
  assert.equal(solve(false),false);
  assert.equal(solve('false'),false);
  assert.equal(solve(1),false);
  assert.equal(solve('true'),false);
});
