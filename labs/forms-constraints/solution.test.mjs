import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("provides required email and bounded number constraints",()=>{assert.match(page,/id="email" name="email" type="email"[^>]*required/);assert.match(page,/id="seats" name="seats" type="number" min="1" max="4" step="1" required/);});
test("provides documented text pattern",()=>{assert.match(page,/pattern="\[A-Z\]\{3\}" minlength="3" maxlength="3"/);assert.match(page,/aria-describedby="code-hint"/);assert.match(page,/id="code-hint"/);});
test("does not claim the client preview saves data",()=>{assert.match(page,/addEventListener\('submit'/);assert.match(page,/event\.preventDefault\(\)/);assert.match(page,/Valid browser input; not saved/);assert.doesNotMatch(page,/novalidate|form\.submit\(/i);});
