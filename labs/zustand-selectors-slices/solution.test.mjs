import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.02 Zustand selectors and slices: real Zustand 5 store contract",()=>{
const store=mod.makeSortStore();
let events=0;const off=store.subscribe(s=>s.sort,()=>events++);
store.getState().setQuery('React');assert.equal(store.getState().query,'React');assert.equal(events,0);
store.getState().setSort('recent');assert.equal(store.getState().sort,'recent');assert.equal(store.getState().query,'React');assert.equal(events,1);off();
});
