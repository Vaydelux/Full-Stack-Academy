import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('validates config and preserves explicit values',()=>{assert.deepEqual(api.parseConfig('PORT=3101\nAPP_MODE=test\nPRIVATE_TOKEN=fake'),{port:3101,mode:'test',privateToken:'fake'});assert.equal(api.parseConfig('PRIVATE_TOKEN=fake').port,3100);});
test('invalid values fail without revealing token',()=>{for(const text of ['PORT=banana\nPRIVATE_TOKEN=fake','PORT=0\nPRIVATE_TOKEN=fake','PORT=65536\nPRIVATE_TOKEN=fake','APP_MODE=wrong\nPRIVATE_TOKEN=fake','PORT=3100'])assert.throws(()=>api.parseConfig(text));});
test('public config explicitly excludes secret',()=>{assert.deepEqual(api.publicConfig(api.parseConfig('PRIVATE_TOKEN=fake')),{port:3100,mode:'development'});});
