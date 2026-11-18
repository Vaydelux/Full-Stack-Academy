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
  assert.ok(html.includes("new URL('https://app.example').origin"),"Missing: new URL('https://app.example').origin");
  assert.ok(html.includes("allowOrigin===requestingOrigin"),"Missing: allowOrigin===requestingOrigin");
  assert.ok(html.includes("allowCredentials===true"),"Missing: allowCredentials===true");
  assert.ok(html.includes("Blocked: credentials require"),"Missing: Blocked: credentials require");
  assert.ok(!html.includes("mode:'no-cors'"),"Forbidden: mode:'no-cors'");
});
