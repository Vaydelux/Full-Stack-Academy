import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Static contract checks; actual browser behavior is tested in scripts/browser-smoke.mjs.
test('integrated page has standards metadata and coherent landmarks',()=>{
 assert.match(page,/^<!doctype html>\s*<html lang="en">/i);
 assert.match(page,/<meta name="viewport" content="width=device-width, initial-scale=1">/);
 for(const tag of ['header','nav','main','aside','footer','figure','figcaption','blockquote'])assert.match(page,new RegExp('<'+tag+'\\b'));
 assert.equal((page.match(/<main\b/g)||[]).length,1);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 assert.match(page,/<title>Community Workshop Handbook<\/title>/);
});
test('navigation target IDs and named regions are present',()=>{
 const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const fragment of [...page.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]))assert.ok(ids.has(fragment),'Missing target '+fragment);
 assert.match(page,/<nav aria-label="Primary navigation">/);
 assert.match(page,/<main id="main-content" tabindex="-1"/);
 assert.match(page,/<aside class="tips" aria-labelledby="tips-heading">/);
 assert.equal((page.match(/<li>/g)||[]).length,6);
});
test('responsive assets and basic keyboard visibility are explicit',()=>{
 assert.match(page,/@media \(min-width: 48rem\)/);
 assert.match(page,/a:focus-visible\{outline:/);
 assert.match(page,/<img src="assets\/workshop-small\.svg" width="640" height="360" alt="Teaching area on the left/);
 assert.match(page,/<source media="\(min-width: 48rem\)" srcset="assets\/workshop-wide\.svg"/);
 assert.match(page,/rel="noopener noreferrer"/);
 assert.doesNotMatch(page,/<script\b|href="javascript:/i);
 for(const file of ['workshop-small.svg','workshop-wide.svg'])assert.match(readFileSync(new URL('./solution/assets/'+file,import.meta.url),'utf8'),/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
});
