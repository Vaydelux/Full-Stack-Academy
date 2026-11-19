import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.04 Derived state and store subscriptions: real Zustand 5 store contract",()=>{
const store=mod.makeQuantityStore();
const initial=store.getState().quantities;
assert.equal(mod.totalOf(store.getState()),3);
let notified=0;const off=store.subscribe(()=>notified++);
store.getState().addQuantity(4);
assert.equal(mod.totalOf(store.getState()),7);
assert.deepEqual(initial,[1,2]);assert.equal(notified,1);off();
});
