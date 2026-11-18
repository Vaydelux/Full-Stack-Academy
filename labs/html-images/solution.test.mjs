import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Static contract checks; actual browser behavior is tested in scripts/browser-smoke.mjs.
test('responsive picture has image alternatives and reserved dimensions',()=>{
 assert.match(page,/<picture>\s*<source media="\(min-width: 48rem\)" srcset="assets\/responsive-wide\.svg" type="image\/svg\+xml">/);
 assert.match(page,/srcset="assets\/responsive-small\.svg 640w, assets\/responsive-wide\.svg 960w"/);
 assert.match(page,/sizes="\(max-width: 48rem\) 100vw, 640px"/);
 assert.match(page,/width="640" height="360" alt="Workshop layout with a teaching area/);
 assert.match(page,/<figcaption>Example: two areas support/);
});
test('image files are local, well-formed SVG examples',()=>{
 assert.match(page,/<img src="assets\/responsive-small\.svg" width="64" height="36" alt="" aria-hidden="true">/);
 for(const file of ['responsive-small.svg','responsive-wide.svg'])assert.match(readFileSync(new URL('./solution/assets/'+file,import.meta.url),'utf8'),/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.doesNotMatch(page,/src="https?:\/\//);
});
