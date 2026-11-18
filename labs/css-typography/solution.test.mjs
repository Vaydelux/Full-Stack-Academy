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
  assert.ok(html.includes("font-size: clamp(1.5rem"), 'Expected repair: '+"font-size: clamp(1.5rem");
  assert.ok(!html.includes(".card h2 { font-size: 12px; line-height: 1; }"), 'Incorrect starter rule must be replaced');
});
