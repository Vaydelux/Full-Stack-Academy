import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.01 TLS and reverse proxies: security boundary",async()=>{
assert.equal(mod.isSecureRequest({encrypted:false,remoteAddress:'198.51.100.2',headers:{'x-forwarded-proto':'https'}},['127.0.0.1']),false);
assert.equal(mod.isSecureRequest({encrypted:false,remoteAddress:'127.0.0.1',headers:{'x-forwarded-proto':'https'}},['127.0.0.1']),true);
assert.equal(mod.isSecureRequest({encrypted:true,remoteAddress:'198.51.100.2',headers:{}},[]),true);
assert.equal(mod.isSecureRequest({encrypted:false,remoteAddress:'127.0.0.1',headers:{'x-forwarded-proto':'https,http'}},['127.0.0.1']),false);
});
