import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("labels persist and native constraints protect fields",()=>{for(const id of ['contact-name','contact-email','message'])assert.match(page,new RegExp('<label for="'+id+'">'));assert.match(page,/id="contact-email" name="email" type="email" autocomplete="email" required/);assert.match(page,/id="message" name="message" rows="5" required minlength="10" aria-describedby="message-hint"/);});
test("radio group and accessible messages exist",()=>{assert.match(page,/<fieldset><legend>Contact preference<\/legend>/);assert.equal((page.match(/type="radio" name="preference"/g)||[]).length,2);assert.match(page,/id="error-summary" role="alert"/);assert.match(page,/id="success-status" role="status" aria-live="polite"/);});
test("capturing invalid keeps browser validation and status truthful",()=>{assert.match(page,/addEventListener\('invalid',[\s\S]+?,true\)/);assert.match(page,/addEventListener\('submit'/);assert.match(page,/event\.preventDefault\(\)/);assert.match(page,/Nothing sent or saved\./);assert.doesNotMatch(page,/<form[^>]*novalidate/);});
