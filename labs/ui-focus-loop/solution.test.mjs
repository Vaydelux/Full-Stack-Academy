import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.04 Keyboard focus traps offline model",()=>{
assert.equal(mod.nextFocus(2,3),0);assert.equal(mod.nextFocus(0,3,true),2);assert.equal(mod.nextFocus(0,0),-1);
});
