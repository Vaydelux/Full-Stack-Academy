import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Immutability and object copying semantics and regression cases",async()=>{
  const before={sku:'x',locations:{A:4,B:2}};const after=solve(before,'A',-2);assert.deepEqual(after.locations,{A:2,B:2});assert.equal(before.locations.A,4);assert.notEqual(after.locations,before.locations);assert.throws(()=>solve(before,'A',-10),RangeError);
});
