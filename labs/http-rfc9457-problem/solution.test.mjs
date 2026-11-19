import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.06 Error envelopes and RFC 9457: HTTP contract acceptance",async()=>{
const res=mod.problemResponse(500,'Internal server error','DATABASE_PASSWORD=SECRET');
assert.equal(res.status,500);assert.match(res.headers.get('content-type')??'',/application\/problem\+json/);
const body=await res.text();
assert.deepEqual(JSON.parse(body),{type:'about:blank',title:'Internal server error',status:500});
assert.doesNotMatch(body,/SECRET|DATABASE_PASSWORD/);
assert.throws(()=>mod.problemResponse(200,'OK','secret'),/Invalid status/);
});
