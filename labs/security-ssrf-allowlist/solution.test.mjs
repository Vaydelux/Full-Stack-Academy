import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.06 Server-side request forgery: security boundary",async()=>{
const hosts=['api.partner.example'];
assert.equal(mod.allowedUpstream('https://api.partner.example/data',hosts),true);
for(const url of ['http://api.partner.example','https://api.partner.example.evil.test','https://evil.test/?target=api.partner.example','https://127.0.0.1/','https://user:pass@api.partner.example/','https://api.partner.example:8443/'])assert.equal(mod.allowedUpstream(url,hosts),false,url);
});
