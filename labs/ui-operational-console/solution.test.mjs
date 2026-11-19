import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.08 Lab operational console data/UX contract",()=>{
const item={id:'t1',status:'pending'};assert.equal(mod.approve('viewer',item),null);assert.deepEqual(mod.approve('reviewer',item),{id:'t1',status:'approved'});assert.equal(item.status,'pending');assert.equal(mod.approve('reviewer',{id:'t1',status:'approved'}),null);
});
