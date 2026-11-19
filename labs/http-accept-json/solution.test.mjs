import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.02 Headers and content negotiation: HTTP contract acceptance",async()=>{
assert.equal(mod.acceptsJson('application/json'),true);
assert.equal(mod.acceptsJson('text/html, application/json;q=0.7'),true);
assert.equal(mod.acceptsJson('application/json;q=0'),false);
assert.equal(mod.acceptsJson('text/html'),false);
assert.equal(mod.acceptsJson('*/*'),true);
});
