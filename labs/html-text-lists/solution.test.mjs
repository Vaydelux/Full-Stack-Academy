import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Static contract checks; actual browser behavior is tested in scripts/browser-smoke.mjs.
test('resource and procedural lists preserve meaning',()=>{
 assert.equal((page.match(/<li>/g)||[]).length,6);
 assert.match(page,/<ul>\s*<li>Notebook for questions/);
 assert.match(page,/<ol>\s*<li>Read the introduction/);
 assert.match(page,/<dl>\s*<dt>Markup<\/dt><dd>/);
});
test('quotation, source title and caption are distinct structures',()=>{
 assert.match(page,/<blockquote><p>A useful workshop/);
 assert.match(page,/<cite>Workshop Handbook<\/cite>/);
 assert.match(page,/<figure><pre><code>&lt;main&gt;/);
 assert.match(page,/<figcaption>Example: one main region/);
 assert.match(page,/<main>\s*<h1>/);
});
