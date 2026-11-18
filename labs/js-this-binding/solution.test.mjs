import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("this binding and callbacks semantics and regression cases",async()=>{
  const reporter={prefix:'lesson',format(value){return this.prefix+':'+value;}};const callback=solve(reporter);assert.equal(callback('css'),'lesson:css');assert.equal([2].map(callback)[0],'lesson:2');assert.throws(()=>solve({}),TypeError);
});
