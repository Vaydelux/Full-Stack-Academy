import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Structural contract only; scripts/browser-smoke.mjs checks the parsed DOM in Chromium.
test('the readable heading outline starts at h1 and nests h3 after h2',()=>{
 const headings=[...page.matchAll(/<h([1-6])\b[^>]*>([^<]+)<\/h\1>/g)].map(m=>({level:Number(m[1]),text:m[2]}));
 assert.deepEqual(headings.map(x=>x.level),[1,2,3,2]);
 assert.equal(headings[0].text,'Plan a community workshop');
 assert.ok(headings.every(x=>x.text.trim().length>=5));
});
test('section labels reference actual heading IDs',()=>{
 for(const id of ['prepare','equipment','session']){assert.match(page,new RegExp('aria-labelledby="'+id+'"'));assert.match(page,new RegExp('<h[23] id="'+id+'">'));}
 assert.doesNotMatch(page,/<div class="heading">/);
});
