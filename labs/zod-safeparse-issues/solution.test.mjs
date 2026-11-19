import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.02 safeParse and error paths: actual Zod 4 schema validation",()=>{
const bad=mod.validateSignup({email:'not-email',age:15});
assert.equal(bad.ok,false);assert.ok(bad.issues.some(x=>x.path==='email'));assert.ok(bad.issues.some(x=>x.path==='age'));
const good=mod.validateSignup({email:'learner@example.test',age:18});
assert.equal(good.ok,true);assert.equal(good.data.age,18);
assert.doesNotThrow(()=>mod.validateSignup(null));
});
