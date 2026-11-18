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
  assert.ok(html.includes("const memory=new Map()"),"Missing: const memory=new Map()");
  assert.ok(html.includes("localStorage.setItem(key,theme)"),"Missing: localStorage.setItem(key,theme)");
  assert.ok(html.includes("catch{memory.set"),"Missing: catch{memory.set");
  assert.ok(html.includes("HttpOnly; SameSite=Lax"),"Missing: HttpOnly; SameSite=Lax");
  assert.ok(!html.includes("localStorage.setItem('access-token'"),"Forbidden: localStorage.setItem('access-token'");
});
