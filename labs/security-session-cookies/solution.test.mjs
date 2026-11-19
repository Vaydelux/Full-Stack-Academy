import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.03 Cookies versus bearer tokens: security boundary",async()=>{
const c=mod.sessionCookie('a'.repeat(24));
assert.match(c,/^__Host-session=/);for(const attr of ['Path=/','HttpOnly','Secure','SameSite=Lax'])assert.ok(c.includes(attr));
assert.doesNotMatch(c,/[\r\n]/);assert.throws(()=>mod.sessionCookie('bad\r\nSet-Cookie: stolen=1'),/Invalid/);
assert.throws(()=>mod.sessionCookie('short'),/Invalid/);
});
