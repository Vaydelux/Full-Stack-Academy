import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.05 Loading empty and error states data/UX contract",()=>{
assert.equal(mod.viewState(false,true,0),'error');assert.equal(mod.viewState(true,false,0),'loading');assert.equal(mod.viewState(false,false,0),'empty');assert.equal(mod.viewState(false,false,2),'ready');
});
