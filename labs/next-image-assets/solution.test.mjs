import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.03 Image and asset optimization policy model",()=>{
assert.deepEqual(mod.assetPlan('hero',1440,900),{width:1440,height:900,preload:true,loading:'eager'});assert.equal(mod.assetPlan('thumbnail',240,160).preload,false);assert.throws(()=>mod.assetPlan('hero',0,160),RangeError);
});
