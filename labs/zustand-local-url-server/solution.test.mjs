import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.01 Local vs URL vs server state: real Zustand 5 store contract",()=>{
const store=mod.makeUiStore();
assert.equal(store.getInitialState().open,false);
store.getState().setOpen(true);assert.equal(store.getState().open,true);
store.getState().setOpen(false);assert.equal(store.getState().open,false);
});
