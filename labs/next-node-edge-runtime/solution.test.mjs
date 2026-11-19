import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.04 Edge vs Node runtime policy model",()=>{
assert.equal(mod.runtimeFor('fs'),'nodejs');assert.equal(mod.runtimeFor('native-db'),'nodejs');assert.equal(mod.runtimeFor('web-fetch'),'edge');
});
