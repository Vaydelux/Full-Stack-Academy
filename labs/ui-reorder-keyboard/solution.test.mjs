import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.06 Drag and drop offline model",()=>{
const ids=['a','b','c'];assert.deepEqual(mod.move(ids,0,2),['b','c','a']);assert.deepEqual(ids,['a','b','c']);assert.deepEqual(mod.move(ids,4,0),ids);
});
