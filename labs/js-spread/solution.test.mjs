import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Destructuring and spread — observed input/output contract",()=>{
  const user={id:'1',profile:{name:'Ada',theme:'light'}};
  const next=solve(user,'dark');
  assert.notEqual(next,user);
  assert.notEqual(next.profile,user.profile);
  assert.deepEqual(next.profile,{name:'Ada',theme:'dark'});
  assert.equal(user.profile.theme,'light');
});
