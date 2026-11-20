import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.02 Request and response contracts: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
assert.equal(mod.hasTaskContracts(document),true);
const missing=structuredClone(document);delete missing.paths['/api/notes'].post.responses['201'];
assert.equal(mod.hasTaskContracts(missing),false);
const bodyless=structuredClone(document);delete bodyless.paths['/api/notes'].post.requestBody;
assert.equal(mod.hasTaskContracts(bodyless),false);
});
