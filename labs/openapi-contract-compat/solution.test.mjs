import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.06 Contract compatibility: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
assert.deepEqual(mod.findBreakingChanges(document,structuredClone(document)),[]);
const removed=structuredClone(document);delete removed.paths['/api/notes'].post;
assert.ok(mod.findBreakingChanges(document,removed).some(x=>x.includes('removed POST')));
const response=structuredClone(document);delete response.paths['/api/notes'].post.responses['201'];
assert.ok(mod.findBreakingChanges(document,response).some(x=>x.includes('removed response 201')));
});
