import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('rejects non-stable version syntax',()=>{assert.deepEqual(api.parseVersion('2.3.4'),[2,3,4]);for(const v of ['2.3','^2.3.4','2.3.4-beta','01.2.3'])assert.throws(()=>api.parseVersion(v));});
test('classifies upgrade risk and downgrades',()=>{assert.equal(api.classifyUpgrade('1.5.0','2.0.0'),'major-review');assert.equal(api.classifyUpgrade('1.5.0','1.6.0'),'minor-review');assert.equal(api.classifyUpgrade('1.5.0','1.5.1'),'patch-review');assert.equal(api.classifyUpgrade('1.5.0','1.4.9'),'downgrade');assert.equal(api.classifyUpgrade('1.5.0','1.5.0'),'same-version');});
