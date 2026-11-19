import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.06 Discriminated unions: actual Zod 4 schema validation",()=>{
assert.equal(mod.Delivery.safeParse({channel:'email',address:'ava@example.test'}).success,true);
assert.equal(mod.Delivery.safeParse({channel:'sms',phone:'+639123456789'}).success,true);
assert.equal(mod.Delivery.safeParse({channel:'fax',address:'ava@example.test'}).success,false);
assert.equal(mod.Delivery.safeParse({channel:'email',address:'not-email'}).success,false);
});
