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
 assert.ok(html.includes(".kit[data-theme=\"dark\"]"),'Missing: '+".kit[data-theme=\"dark\"]");
 assert.ok(!html.includes(".kit { background: #ffffff; color: #17364a; } .kit-content { display: grid; grid-template-columns: 1fr 1fr; } .kit-button:focus-visible { outline: none; }"),'Original defective rule is still present');
});
