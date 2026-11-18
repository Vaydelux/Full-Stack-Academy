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
  assert.ok(html.includes("color-scheme: light dark"),'Missing: '+"color-scheme: light dark");
  assert.ok(!html.includes(".qa { inline-size: 900px; padding-left: 2rem; border-left: 4px solid #075e7b; background: #ffffff; color: #19354a; } .qa-action:focus-visible { outline: none; } .qa-action { transition: all 3s ease; }"),'Original incorrect rule remains');
});

test('capstone rubric is exactly 100 evidence-based points',()=>{
 const rubric=JSON.parse(readFileSync(new URL('./rubric.json',import.meta.url),'utf8'));
 assert.equal(rubric.maxPoints,100);
 assert.equal(rubric.dimensions.length,5);
 assert.equal(new Set(rubric.dimensions.map(x=>x.id)).size,5);
 assert.equal(rubric.dimensions.reduce((sum,x)=>sum+x.points,0),100);
 assert.ok(rubric.disclaimer.includes('automated checks cover selected points'));
});
