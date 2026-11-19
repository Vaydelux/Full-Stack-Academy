import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.01 Verbs and status codes: HTTP contract acceptance",async()=>{
assert.deepEqual(mod.chooseStatus('GET',true),{status:200});
assert.deepEqual(mod.chooseStatus('GET',false),{status:404});
assert.deepEqual(mod.chooseStatus('POST',false),{status:201});
assert.deepEqual(mod.chooseStatus('DELETE',true),{status:204});
assert.equal(mod.chooseStatus('TRACE',true).status,405);
});
