import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
test('self-contained local semantics and no remote resources',()=>{
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<main>/);
  assert.match(html,/<section class="demo" id="demo">/);
  assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+href="https?:|@import\s+url|fetch\s*\(/i);
});
test('repaired instructor CSS is present without original defect',()=>{
  assert.ok(html.includes("overscroll-behavior: contain"), 'Missing CSS repair: '+"overscroll-behavior: contain");
  assert.ok(!html.includes(".resources { max-block-size: 8rem; overflow: visible; }"), 'Broken starter declaration remains');
});
