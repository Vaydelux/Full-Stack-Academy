import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.04 refine and superRefine: actual Zod 4 schema validation",()=>{
assert.equal(mod.Passwords.safeParse({password:'12345678',confirmPassword:'12345678'}).success,true);
const invalid=mod.Passwords.safeParse({password:'12345678',confirmPassword:'abcdefghi'});
assert.equal(invalid.success,false);
if(invalid.success)throw new Error('Expected rejected confirmation');
assert.ok(invalid.error.issues.some(x=>x.path.join('.')==='confirmPassword'));
});
