import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.04 Examples and operation IDs: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
assert.deepEqual(mod.operationIdIssues(document),[]);
const duplicated=structuredClone(document);duplicated.paths['/api/notes'].post.operationId='listNotes';
assert.deepEqual(mod.operationIdIssues(duplicated),['duplicate listNotes']);
const missing=structuredClone(document);delete missing.paths['/api/notes'].get.operationId;
assert.ok(mod.operationIdIssues(missing).some(x=>x.startsWith('invalid')));
});
