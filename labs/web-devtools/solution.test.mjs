import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const html=readFileSync(new URL('./'+target+'/index.html',import.meta.url),'utf8');
test('offline page has native controls and one main landmark',()=>{
  assert.match(html,/<html lang="en">/);assert.match(html,/<main>/);assert.match(html,/<h1>/);assert.match(html,/<output id="status" role="status">/);
  assert.doesNotMatch(html,/<script[^>]+src=|<iframe[^>]+src="https?:/i);
});
test('instructor behavior checks guard against regression',()=>{
  assert.ok(html.includes("URL.createObjectURL(blob)"),"Missing: URL.createObjectURL(blob)");
  assert.ok(html.includes("await fetch(url)"),"Missing: await fetch(url)");
  assert.ok(html.includes("URL.revokeObjectURL(url)"),"Missing: URL.revokeObjectURL(url)");
  assert.ok(html.includes("if(!response.ok)"),"Missing: if(!response.ok)");
  assert.ok(html.includes("JSON parsing failed"),"Missing: JSON parsing failed");
  assert.ok(!html.includes("document.cookie"),"Forbidden: document.cookie");
});
