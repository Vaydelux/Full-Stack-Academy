import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const html = readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
test('offline semantic CSS practice scaffold',()=>{
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<main>/);
  assert.match(html,/<h1>/);
  assert.match(html,/<section class="card"/);
  assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src=["']https?:/i);
});
test('instructor solution repairs the specific CSS defect',()=>{
  assert.ok(html.includes("@media (min-width: 42rem)"), 'Expected repair: '+"@media (min-width: 42rem)");
  assert.ok(!html.includes(".card { box-sizing: content-box; inline-size: 100%; padding-left: 2rem; border-left: 4px solid #075e7b; } .card h2 { font-size: 18px; } .action:focus-visible { outline: none; }"), 'Incorrect starter rule must be replaced');
});
