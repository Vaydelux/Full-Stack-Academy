import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.03.03 use cache and cache tags cache decision model",()=>{
assert.equal(mod.courseTag('react-19'),'courses:react-19');
assert.equal(mod.courseTag('next-16'),'courses:next-16');
assert.notEqual(mod.courseTag('react-19'),mod.courseTag('next-16'));
assert.throws(()=>mod.courseTag('../private'),/Invalid course ID/);
});
