import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.01 Semantic metadata local SEO/accessibility contract",()=>{
assert.equal(mod.articleMetadata('React tips',true).robots.index,true);
assert.equal(mod.articleMetadata('Draft',false).robots.index,false);
assert.match(mod.articleMetadata(' React tips ',true).title,/React tips \| Academy/);
});
