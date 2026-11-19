import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.02 Reverse proxy and headers policy model",()=>{
const hosts=['academy.example','localhost:3000'];assert.equal(mod.trustedHost('academy.example',hosts),true);assert.equal(mod.trustedHost('academy.example.evil.test',hosts),false);assert.equal(mod.trustedHost('academy.example:444',hosts),false);assert.equal(mod.trustedHost('academy.example\r\nBad:1',hosts),false);
});
