import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.06 Cross-browser testing local QA contract",()=>{
assert.equal(mod.coverageComplete([{engine:'chromium',input:'mouse'}]),false);assert.equal(mod.coverageComplete([{engine:'chromium',input:'keyboard'},{engine:'firefox',input:'keyboard'},{engine:'webkit',input:'touch'}]),true);assert.equal(mod.coverageComplete([]),false);
});
