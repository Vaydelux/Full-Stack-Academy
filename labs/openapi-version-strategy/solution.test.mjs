import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.04.07 API version strategy: real OpenAPI 3.1 contract",async()=>{
assert.equal(mod.selectApiVersion('application/json'),'v1');
assert.equal(mod.selectApiVersion('application/vnd.academy.v2+json'),'v2');
assert.equal(mod.selectApiVersion('application/vnd.academy.v1+json'),'v1');
assert.throws(()=>mod.selectApiVersion('application/vnd.academy.v3+json'),/Unsupported API version/);
});
