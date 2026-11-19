import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.03 Virtualized lists data/UX contract",()=>{
assert.deepEqual(mod.visibleRange(100,20,10,2),{from:18,to:32});assert.deepEqual(mod.visibleRange(5,3,10,4),{from:0,to:5});assert.throws(()=>mod.visibleRange(-1,0,5,0),RangeError);
});
