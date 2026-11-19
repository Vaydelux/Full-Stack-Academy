import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.05 transform and coercion: actual Zod 4 schema validation",()=>{
assert.deepEqual(mod.Contact.parse({email:'USER@EXAMPLE.COM',age:'21'}),{email:'user@example.com',age:21});
assert.equal(mod.Contact.safeParse({email:'user@example.com',age:'abc'}).success,false);
assert.equal(mod.Contact.safeParse({email:'user@example.com',age:'17'}).success,false);
});
