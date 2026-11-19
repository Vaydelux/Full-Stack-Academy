import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.06 URLSearchParams as state: real Zustand 5 store contract",()=>{
const store=mod.makeQueryStore('?status=active');assert.equal(store.getState().status,'active');
assert.equal(mod.toQuery(store),'status=active');
store.getState().setStatus('all');assert.equal(mod.toQuery(store),'');
assert.equal(mod.makeQueryStore('?status=admin').getState().status,'all');
});
