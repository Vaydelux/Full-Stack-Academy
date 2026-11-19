import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.04.03 Sitemap and robots local SEO/accessibility contract",()=>{
const pages=[{slug:'react',published:true,public:true},{slug:'draft',published:false,public:true},{slug:'secret',published:true,public:false},{slug:'react',published:true,public:true}];
assert.deepEqual(mod.sitemapSlugs(pages),['react']);
});
