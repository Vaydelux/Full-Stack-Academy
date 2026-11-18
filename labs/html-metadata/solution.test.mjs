import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Structural contract only; scripts/browser-smoke.mjs checks the parsed DOM in Chromium.
test('head contains encoding, viewport and descriptive metadata',()=>{
 const head=page.split('</head>')[0];
 assert.match(head,/<meta charset="utf-8">/);
 assert.match(head,/<meta name="viewport" content="width=device-width, initial-scale=1">/);
 assert.match(head,/<title>Visitor guide \| Community workshop<\/title>/);
 assert.match(head,/<meta name="description" content="Find workshop hours,/);
 assert.equal((page.match(/<title>/g)||[]).length,1);
});
test('canonical URL and Open Graph fields agree with the title',()=>{
 assert.match(page,/<link rel="canonical" href="https:\/\/example\.com\/workshop\/visitor-guide">/);
 assert.match(page,/<meta property="og:type" content="article">/);
 assert.match(page,/<meta property="og:title" content="Visitor guide \| Community workshop">/);
 assert.match(page,/<h1>Plan your first workshop visit<\/h1>/);
});
