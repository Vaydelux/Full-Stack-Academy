import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.07 ETags and caching: HTTP contract acceptance",async()=>{
const first=mod.conditionalJson({a:1});
assert.equal(first.status,200);
const tag=first.headers.get('etag');assert.ok(tag);
const cached=mod.conditionalJson({a:1},tag);
assert.equal(cached.status,304);assert.equal(await cached.text(),'');
const weak=mod.conditionalJson({a:1},'W/'+tag);assert.equal(weak.status,304);
assert.equal(mod.conditionalJson({a:2},tag).status,200);
});
