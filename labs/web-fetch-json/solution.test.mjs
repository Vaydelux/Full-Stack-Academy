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
  assert.ok(html.includes("if(!response.ok)"),"Missing: if(!response.ok)");
  assert.ok(html.includes("response.json()"),"Missing: response.json()");
  assert.ok(html.includes("new AbortController()"),"Missing: new AbortController()");
  assert.ok(html.includes("AbortError"),"Missing: AbortError");
  assert.ok(html.includes("JSON parsing failed."),"Missing: JSON parsing failed.");
});
