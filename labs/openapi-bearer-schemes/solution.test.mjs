import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.03 OpenAPI security schemes: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
assert.equal(mod.secureOperations(document),true);
const unprotected=structuredClone(document);unprotected.paths['/api/notes'].post.security=[];
assert.equal(mod.secureOperations(unprotected),false);
const global=structuredClone(document);delete global.components.securitySchemes.BearerAuth;
assert.equal(mod.secureOperations(global),false);
});
