import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.02 CORS versus CSRF: security boundary",async()=>{
assert.deepEqual(mod.checkOrigin('https://academy.example',['https://academy.example']),{corsOrigin:'https://academy.example',allowCredentials:true,allowWrite:true});
assert.deepEqual(mod.checkOrigin('https://evil.example',['https://academy.example']),{corsOrigin:null,allowCredentials:false,allowWrite:false});
assert.equal(mod.checkOrigin('https://academy.example.evil.test',['https://academy.example']).allowWrite,false);
});
