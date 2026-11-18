import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("uses GET with a named required control",()=>{assert.match(page,/<form action="receipt\.html" method="get">/);assert.match(page,/<input id="query" name="q" required>/);});
test("distinguishes submit helper and reset actions",()=>{assert.match(page,/<button type="submit">Search<\/button>/);assert.match(page,/<button type="button" id="help">Explain search<\/button>/);assert.match(page,/<button type="reset">Clear form<\/button>/);});
test("has a bundled local destination and safe help listener",()=>{assert.match(readFileSync(new URL('./solution/receipt.html',import.meta.url),'utf8'),/This is an offline destination/);assert.match(page,/addEventListener\('click'/);assert.doesNotMatch(page,/https?:\/\/.*action=/);});
