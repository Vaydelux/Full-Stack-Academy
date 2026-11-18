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
  assert.ok(html.includes("outline: 3px solid #c44804"), 'Expected repair: '+"outline: 3px solid #c44804");
  assert.ok(!html.includes(".action:focus-visible { outline: none; }"), 'Incorrect starter rule must be replaced');
});
