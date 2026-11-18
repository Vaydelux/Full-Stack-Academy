import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("modal has a name and focusable heading",()=>{assert.match(page,/<dialog id="settings" aria-labelledby="settings-title">/);assert.match(page,/<h2 id="settings-title" tabindex="-1">Workshop settings<\/h2>/);assert.match(page,/<button type="button" id="close-dialog">Close settings<\/button>/);});
test("native open and close paths restore focus",()=>{assert.match(page,/dialog\.showModal\(\)/);assert.match(page,/dialog\.close\(\)/);assert.match(page,/dialog\.addEventListener\('close'/);assert.match(page,/opener\.focus\(\)/);});
test("does not introduce positive tab indices or role overrides",()=>{assert.doesNotMatch(page,/tabindex="[1-9]|role="dialog"|keydown.*Tab/);assert.match(page,/class="skip" href="#main-content"/);});
