import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
// Structural contract only; scripts/browser-smoke.mjs checks the parsed DOM in Chromium.
test('standards-mode document has ordered containers and language',()=>{
  assert.match(page,/^<!doctype html>\s*<html lang="en">/i);
  const head=page.indexOf('<head>'),body=page.indexOf('<body>');
  assert.ok(head>0&&body>head&&page.indexOf('</head>')<body);
  assert.equal((page.match(/<body\b/g)||[]).length,1);
  assert.match(page,/<meta charset="utf-8">/);
  assert.match(page,/<title>Workshop guide/);
  assert.match(page,/<meta name="viewport" content="width=device-width, initial-scale=1">/);
});
test('one primary content region contains meaningful headings',()=>{
  assert.equal((page.match(/<main\b/g)||[]).length,1);
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.match(page,/<section aria-labelledby="reason">\s*<h2 id="reason">/);
  assert.match(page,/<footer>/);
});
