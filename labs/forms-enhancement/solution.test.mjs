import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("provides native no-script form contract",()=>{assert.match(page,/<form id="question-form" action="receipt\.html" method="get">/);assert.match(page,/<textarea id="question" name="question" rows="5" required>/);assert.match(page,/<button type="submit">Preview question<\/button>/);});
test("enhances with a visible honest status",()=>{assert.match(page,/id="status" role="status" aria-live="polite"/);assert.match(page,/addEventListener\('submit'/);assert.match(page,/event\.preventDefault\(\)/);assert.match(page,/Nothing sent\./);});
test("fallback receipt exists and does not imply persistence",()=>{assert.match(readFileSync(new URL('./solution/receipt.html',import.meta.url),'utf8'),/cannot receive or store your submission/);assert.doesNotMatch(page,/action="https?:/);});
