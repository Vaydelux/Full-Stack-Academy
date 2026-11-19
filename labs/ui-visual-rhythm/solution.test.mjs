import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.01 Visual hierarchy and spacing local QA contract",()=>{
assert.equal(mod.spaceFor(1),4);assert.equal(mod.spaceFor(6),24);assert.throws(()=>mod.spaceFor(13),RangeError);
});
