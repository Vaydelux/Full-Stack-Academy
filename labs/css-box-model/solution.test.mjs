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
  assert.ok(html.includes("box-sizing: border-box"), 'Expected repair: '+"box-sizing: border-box");
  assert.ok(!html.includes(".card { box-sizing: content-box; inline-size: 100%; max-inline-size: 34rem; padding: 2rem; border: 3px solid #195472; }"), 'Incorrect starter rule must be replaced');
});
