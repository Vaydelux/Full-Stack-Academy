import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.07 Responsive navigation local fixture",()=>{
const items=[{href:'/learn',visible:true,enabled:true},{href:'/draft',visible:false,enabled:true},{href:'/soon',visible:true,enabled:false}];assert.deepEqual(mod.menuLinks(items).map(x=>x.href),['/learn']);assert.equal(items.length,3);
});
