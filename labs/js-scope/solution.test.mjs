import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("let const and scope — observed input/output contract",()=>{
  assert.equal(solve([2,3]),5);
  assert.equal(solve([]),0);
  assert.equal(solve([1,1]),2);
  assert.throws(()=>solve([NaN]),TypeError);
});
