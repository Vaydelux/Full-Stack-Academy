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
  assert.ok(html.includes("sandbox=\"allow-scripts\""),"Missing: sandbox=\"allow-scripts\"");
  assert.ok(html.includes("event.source!==frame.contentWindow"),"Missing: event.source!==frame.contentWindow");
  assert.ok(html.includes("event.origin!=='null'"),"Missing: event.origin!=='null'");
  assert.ok(html.includes("event.data.value!=='isolated'"),"Missing: event.data.value!=='isolated'");
  assert.ok(!html.includes("allow-same-origin"),"Forbidden: allow-same-origin");
});
