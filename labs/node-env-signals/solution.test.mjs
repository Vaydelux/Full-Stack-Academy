import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.01.02 process.env and signals: actual Node core module behavior",async()=>{
assert.deepEqual(mod.readConfig({}),{port:3000,mode:'development'});
assert.deepEqual(mod.readConfig({PORT:'8080',NODE_ENV:'production'}),{port:8080,mode:'production'});
for(const port of ['0','65536','abc','10.5','-1'])assert.throws(()=>mod.readConfig({PORT:port}),/Invalid PORT/);
assert.throws(()=>mod.readConfig({NODE_ENV:'secret'}),/Invalid NODE_ENV/);
});
