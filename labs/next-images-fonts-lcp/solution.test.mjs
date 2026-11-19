import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.05 Images fonts and LCP local SEO/accessibility contract",()=>{
assert.deepEqual(mod.imagePlan(1440,900,true),{width:1440,height:900,preload:true,sizes:'(max-width: 768px) 100vw, 720px'});
assert.equal(mod.imagePlan(640,400,false).preload,false);
assert.throws(()=>mod.imagePlan(0,400,true),RangeError);
});
