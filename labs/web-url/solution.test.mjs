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
  assert.ok(html.includes("new URL(input.value,base)"),"Missing: new URL(input.value,base)");
  assert.ok(html.includes("url.origin!==base.origin"),"Missing: url.origin!==base.origin");
  assert.ok(html.includes("searchParams.append('tag'"),"Missing: searchParams.append('tag'");
  assert.ok(html.includes("searchParams.getAll('tag')"),"Missing: searchParams.getAll('tag')");
  assert.ok(!html.includes("location.href="),"Forbidden: location.href=");
});
