import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Arrays and objects — observed input/output contract",()=>{
  const xs=[{name:'A',price:2},{name:'B',price:5}];
  assert.deepEqual(solve(xs),{names:['B','A'],total:7});
  assert.equal(xs[0].name,'A');
  assert.deepEqual(solve([]),{names:[],total:0});
  assert.throws(()=>solve([{name:'A',price:NaN}]),TypeError);
});
