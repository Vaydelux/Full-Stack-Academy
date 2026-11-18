import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('new sessions are opaque, distinct and expire',()=>{let now=0;const s=api.createSessions(()=>now);const id=s.create('u1',100);assert.notEqual(id,'u1');assert.notEqual(id,s.create('u1',100));assert.equal(s.get(id),'u1');now=100;assert.equal(s.get(id),null);assert.throws(()=>s.create('u1',0));});
test('cookie contains scoped defensive attributes',()=>{const value=api.sessionCookie('demo');assert.match(value,/^__Host-academy_session=demo;/);for(const part of ['Path=/','HttpOnly','Secure','SameSite=Lax'])assert.ok(value.includes(part));assert.doesNotMatch(value,/Domain=/i);});
test('only a valid server session resolves, and revocation works',()=>{const s=api.createSessions();const id=s.create('u1');const header='__Host-academy_session='+id;assert.equal(api.readSession(header,s),'u1');assert.equal(api.readSession('userId=admin',s),null);assert.equal(api.readSession(header+'; '+header,s),null);assert.equal(api.readSession('__Host-academy_session=%ZZ',s),null);s.revoke(id);assert.equal(api.readSession(header,s),null);});
