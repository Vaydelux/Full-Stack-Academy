import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.07 Sensitive data redaction: security boundary",async()=>{
const item={id:'task-1',headers:{Authorization:'Bearer SECRET',cookie:'session=SECRET'},nested:[{password:'SECRET',title:'Public'}]};
const original=JSON.stringify(item),out=mod.redactLog(item);
assert.equal(out.id,'task-1');assert.equal(out.headers.Authorization,'[REDACTED]');
assert.equal(out.nested[0].password,'[REDACTED]');
assert.doesNotMatch(JSON.stringify(out),/SECRET/);assert.equal(JSON.stringify(item),original);
});
