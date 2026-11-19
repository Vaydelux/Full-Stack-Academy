import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.03 JSON serialization: HTTP contract acceptance",async()=>{
assert.deepEqual(mod.parseJsonObject('{"name":"Ada"}'),{name:'Ada'});
assert.throws(()=>mod.parseJsonObject('{"__proto__":{"polluted":true}}'),/Unsafe key/);
assert.throws(()=>mod.parseJsonObject('{"name":"lengthy"}',4),/Body too large/);
assert.throws(()=>mod.parseJsonObject('[]'),/Expected object/);
});
