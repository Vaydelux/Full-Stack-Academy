import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.01 OpenAPI 3.1 structure: real OpenAPI 3.1 contract",async()=>{
const {loadTaskSpec}=await import('../../examples/task-contract/load-spec.mjs');
const document=await loadTaskSpec();
assert.deepEqual(mod.summarizeDocument(document),{version:'3.1.1',title:'Academy Loopback Notes API',operationCount:3});
assert.throws(()=>mod.summarizeDocument({openapi:'3.0.0',paths:{}}),/Invalid OpenAPI/);
});
