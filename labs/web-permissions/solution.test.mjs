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
  assert.ok(html.includes("navigator.clipboard?.writeText"),"Missing: navigator.clipboard?.writeText");
  assert.ok(html.includes("await navigator.clipboard.writeText(sample)"),"Missing: await navigator.clipboard.writeText(sample)");
  assert.ok(html.includes("catch{status.textContent='Clipboard unavailable"),"Missing: catch{status.textContent='Clipboard unavailable");
  assert.ok(html.includes("readonly"),"Missing: readonly");
  assert.ok(!html.includes("document.execCommand"),"Forbidden: document.execCommand");
});
