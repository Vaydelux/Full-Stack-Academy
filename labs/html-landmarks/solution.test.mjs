import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Structural contract only; scripts/browser-smoke.mjs checks the parsed DOM in Chromium.
test('uses native landmarks and named navigation',()=>{
 for(const tag of ['header','nav','main','aside','footer'])assert.match(page,new RegExp('<'+tag+'\\b'));
 assert.equal((page.match(/<main\b/g)||[]).length,1);
 assert.match(page,/<nav aria-label="Primary navigation">/);
 assert.match(page,/<aside aria-labelledby="resources-heading">/);
});
test('skip navigation references real main and headings',()=>{
 assert.match(page,/<body>\s*<a href="#main-content">Skip to main content<\/a>/);
 assert.match(page,/<main id="main-content">/);
 assert.match(page,/<h2 id="resources-heading">Further resources<\/h2>/);
 assert.match(page,/<h1 id="overview">Learn the basics<\/h1>/);
});
