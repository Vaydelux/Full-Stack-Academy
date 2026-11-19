import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.03 Optional, nullable and defaults: actual Zod 4 schema validation",()=>{
assert.deepEqual(mod.Prefs.parse({bio:null}),{bio:null,optIn:false,locale:'en'});
assert.deepEqual(mod.Prefs.parse({}),{optIn:false,locale:'en'});
assert.equal(mod.Prefs.safeParse({locale:'xx'}).success,false);
});
