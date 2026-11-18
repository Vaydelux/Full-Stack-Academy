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
 assert.ok(html.includes("light-dark(#ffffff, #172e45)"),'Missing: '+"light-dark(#ffffff, #172e45)");
 assert.ok(!html.includes(".demo { color-scheme: light; background: #ffffff; color: #18344a; }"),'Original defective rule is still present');
});
