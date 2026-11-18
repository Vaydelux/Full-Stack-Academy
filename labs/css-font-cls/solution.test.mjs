import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
test('offline performance/a11y fixture is semantic and self contained',()=>{
  assert.match(html,/<html lang="en">/);assert.match(html,/<main>/);assert.match(html,/<section class="demo" id="demo"/);
  assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+href=["']https?:|@import\s+url|fetch\s*\(/i);
});
test('the targeted CSS performance or accessibility repair is present',()=>{
  assert.ok(html.includes("aspect-ratio: 16 / 9"),'Missing: '+"aspect-ratio: 16 / 9");
  assert.ok(!html.includes(".media { inline-size: 100%; } .headline { font-family: serif; line-height: 1; }"),'Original incorrect rule remains');
});
