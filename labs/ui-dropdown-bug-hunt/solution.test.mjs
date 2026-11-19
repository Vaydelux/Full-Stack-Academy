import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.08 Bug Hunt inaccessible dropdown offline model",()=>{
assert.equal(mod.initialMenuFocus([{id:'a',disabled:true},{id:'b',disabled:false}]),1);assert.equal(mod.initialMenuFocus([{id:'a',disabled:true}]),-1);assert.equal(mod.initialMenuFocus([]),-1);
});
