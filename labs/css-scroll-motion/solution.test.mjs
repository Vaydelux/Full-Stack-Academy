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
  assert.ok(html.includes("prefers-reduced-motion: no-preference"),'Missing: '+"prefers-reduced-motion: no-preference");
  assert.ok(!html.includes(".indicator { animation: float 2s ease-in-out infinite; } @keyframes float { 50% { transform: translateY(-1rem); } }"),'Original incorrect rule remains');
});
