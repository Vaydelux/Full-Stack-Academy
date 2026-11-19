import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.01 Objects, primitives, enums and literals: actual Zod 4 schema validation",()=>{
assert.deepEqual(mod.AccountSchema.parse({displayName:' Ava ',role:'reader',active:true}),{displayName:'Ava',role:'reader',active:true});
assert.equal(mod.AccountSchema.safeParse({displayName:'Ava',role:'admin',active:true}).success,false);
assert.equal(mod.AccountSchema.safeParse({displayName:'Ava',role:'reader',active:true,privateKey:'secret'}).success,false);
});
