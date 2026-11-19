import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.07 Schema composition and inference: actual Zod 4 schema validation",()=>{
assert.deepEqual(mod.User.parse({id:'u1',name:' Ava ',role:'reader'}),{id:'u1',name:'Ava',role:'reader'});
assert.equal(mod.User.safeParse({id:'u1',name:'Ava',role:'admin'}).success,false);
assert.equal(mod.User.safeParse({id:'u1',name:'Ava',role:'reader',secret:1}).success,false);
});
