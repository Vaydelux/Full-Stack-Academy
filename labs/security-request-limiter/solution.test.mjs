import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.03.04 Rate limiting and abuse controls: security boundary",async()=>{
const l=mod.makeLimiter(2,1000);
assert.deepEqual(l.check('alice',0),{allowed:true,remaining:1});
assert.deepEqual(l.check('alice',100),{allowed:true,remaining:0});
assert.deepEqual(l.check('alice',200),{allowed:false,remaining:0});
assert.deepEqual(l.check('bob',200),{allowed:true,remaining:1});
assert.equal(l.check('alice',1200).allowed,true);
});
