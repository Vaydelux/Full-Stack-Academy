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
  assert.ok(html.includes("createElement('li')"),"Missing: createElement('li')");
  assert.ok(html.includes("item.textContent=value"),"Missing: item.textContent=value");
  assert.ok(html.includes("list.replaceChildren(item)"),"Missing: list.replaceChildren(item)");
  assert.ok(html.includes("addEventListener('click'"),"Missing: addEventListener('click'");
  assert.ok(!html.includes(".innerHTML="),"Forbidden: .innerHTML=");
});
