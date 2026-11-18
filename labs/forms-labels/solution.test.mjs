import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("has explicit labels and IDs for text fields",()=>{assert.match(page,/<label for="full-name">Full name<\/label>/);assert.match(page,/<input id="full-name" name="fullName"[^>]*required>/);assert.match(page,/<label for="contact-email">Contact email<\/label>/);assert.match(page,/aria-describedby="email-hint"/);assert.match(page,/id="email-hint"/);});
test("groups accessible radio controls",()=>{assert.match(page,/<fieldset><legend>Preferred session<\/legend>/);assert.equal((page.match(/type="radio" name="session"/g)||[]).length,2);assert.match(page,/<label><input type="radio" name="session" value="morning" required> Morning<\/label>/);});
test("prevents an instructional-only submission",()=>{assert.match(page,/addEventListener\('submit'/);assert.match(page,/event\.preventDefault\(\)/);assert.match(page,/<button type="submit">Preview fields<\/button>/);});
