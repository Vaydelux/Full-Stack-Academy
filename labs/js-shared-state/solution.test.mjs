import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Bug Hunt shared mutable state semantics and regression cases",async()=>{
  const a=solve(['A']),b=solve(['B']);a.add('C');assert.deepEqual(a.read(),['A','C']);assert.deepEqual(b.read(),['B']);const snapshot=a.read();snapshot.push('external');assert.deepEqual(a.read(),['A','C']);assert.throws(()=>solve(null),TypeError);
});
