import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("has a working first skip link and a focusable main",()=>{assert.match(page,/<body>\s*<a class="skip" href="#main-content">Skip to main content<\/a>/);assert.match(page,/<main id="main-content" tabindex="-1">/);assert.match(page,/a:focus-visible/);});
test("uses semantic navigation and keyboard-activatable action",()=>{assert.match(page,/<nav aria-label="Page navigation">/);assert.match(page,/<button type="button" id="reveal-tip">Show keyboard tip<\/button>/);assert.doesNotMatch(page,/onclick=|tabindex="[1-9]/i);});
test("has named local targets and a polite status",()=>{assert.match(page,/id="resources"/);assert.match(page,/id="questions"/);assert.match(page,/id="tip" role="status" aria-live="polite"/);assert.match(page,/addEventListener\('click'/);});
