import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.02 Canonical and Open Graph local SEO/accessibility contract",()=>{
assert.equal(mod.canonicalArticleUrl('https://academy.example','react-tips'),'https://academy.example/articles/react-tips');
assert.throws(()=>mod.canonicalArticleUrl('http://academy.example','x'),/Invalid origin/);
assert.throws(()=>mod.canonicalArticleUrl('https://evil.example','react'),/Invalid origin/);
assert.throws(()=>mod.canonicalArticleUrl('https://academy.example','../admin'),/Invalid slug/);
});
