import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.08 Bug Hunt auth cache leak offline boundary checks",()=>{
const privateRow={tenantId:'t1',visibility:'private'};assert.deepEqual(mod.readDecision({userId:'u1',tenantId:'t1'},privateRow),{allowed:true,cache:'request'});assert.deepEqual(mod.readDecision({userId:'u2',tenantId:'t2'},privateRow),{allowed:false,cache:'request'});assert.deepEqual(mod.readDecision(null,privateRow),{allowed:false,cache:'request'});assert.deepEqual(mod.readDecision(null,{tenantId:'t1',visibility:'public'}),{allowed:true,cache:'shared'});
});
