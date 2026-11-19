import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.07 Content architecture for discoverability local SEO/accessibility contract",()=>{
const items=[{id:'a',title:'React',published:true},{id:'b',title:'Draft',published:false}];
assert.deepEqual(mod.publicOutline(items),[items[0]]);assert.equal(items.length,2);
});
