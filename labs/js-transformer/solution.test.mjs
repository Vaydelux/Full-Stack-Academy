import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lab data transformer — observed input/output contract",()=>{
  const rows=[{name:'Z',qty:2,price:1.25},{name:'  A  ',qty:1,price:4},{name:'bad',qty:-1,price:4}];
  const before=structuredClone(rows);
  assert.deepEqual(solve(rows),[{name:'A',total:4},{name:'Z',total:2.5}]);
  assert.deepEqual(rows,before);
  assert.deepEqual(solve([]),[]);
  assert.throws(()=>solve(null),TypeError);
});
