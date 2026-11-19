import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.04 Usability heuristics local QA contract",()=>{
assert.equal(mod.heuristicSeverity(4,4),4);assert.equal(mod.heuristicSeverity(0,0),0);assert.ok(mod.heuristicSeverity(4,4)>mod.heuristicSeverity(1,1));assert.throws(()=>mod.heuristicSeverity(5,1),RangeError);
});
