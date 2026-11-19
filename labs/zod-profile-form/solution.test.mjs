import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.01.08 Lab validated profile form: actual Zod 4 schema validation",()=>{
const good=mod.validateProfile({displayName:' Ava ',email:'AVA@EXAMPLE.COM',age:'21',contact:'email',agreed:true});
assert.equal(good.success,true);
if(!good.success)throw new Error('Expected valid profile');
assert.deepEqual(good.data,{displayName:'Ava',email:'ava@example.com',age:21,contact:'email',agreed:true});
assert.equal(mod.validateProfile({displayName:'Ava',email:'ava@example.com',age:'17',agreed:true}).success,false);
assert.equal(mod.validateProfile({displayName:'Ava',email:'ava@example.com',age:'21',agreed:false}).success,false);
assert.equal(mod.validateProfile({displayName:'Ava',email:'ava@example.com',age:'21',agreed:true,role:'admin'}).success,false);
});
