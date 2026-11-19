import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.01 Motion animation primitives offline model",()=>{
assert.deepEqual(mod.motionPlan(true),{durationMs:0,translatePx:0});assert.deepEqual(mod.motionPlan(false),{durationMs:180,translatePx:8});
});
