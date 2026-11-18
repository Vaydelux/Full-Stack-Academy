import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
test('standalone design-system fixture has one semantic main and no external dependencies',()=>{
 assert.match(html,/<html lang="en">/);assert.match(html,/<main>/);assert.match(html,/<section class="demo" id="demo">/);
 assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+href=["']https?:|@import\s+url|fetch\s*\(/i);
});
test('CSS defect is replaced with the instructor stateful rule',()=>{
 assert.ok(html.includes("& .label { color:"),'Missing: '+"& .label { color:");
 assert.ok(!html.includes(".demo { .missing-label { color: #075e7b; } &:focus-within { outline: none; } }"),'Original defective rule is still present');
});
