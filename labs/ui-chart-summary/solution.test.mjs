import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.07 Responsive charts offline model",()=>{
assert.deepEqual(mod.describeSeries([3,5,2]),{count:3,total:10});assert.deepEqual(mod.describeSeries([]),{count:0,total:0});assert.throws(()=>mod.describeSeries([NaN]),RangeError);
});
