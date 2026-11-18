import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("has keyboard skip link and named landmarks",()=>{assert.match(page,/<a class="skip" href="#main-content">Skip to main content<\/a>/);assert.match(page,/<main id="main-content" tabindex="-1">/);assert.match(page,/<nav aria-label="Primary navigation">/);assert.match(page,/button:focus-visible/);});
test("names controls and image with an honest local status",()=>{assert.match(page,/<label for="topic">Workshop topic<\/label>/);assert.match(page,/aria-describedby="topic-hint" required/);assert.match(page,/alt="Teaching space on the left, shared notes on the right"/);assert.match(page,/id="preview-status" role="status" aria-live="polite"/);assert.match(page,/Nothing sent or saved\./);});
test("native modal handles focus and reduced motion",()=>{assert.match(page,/<dialog id="help-dialog" aria-labelledby="help-title">/);assert.match(page,/dialog\.showModal\(\)/);assert.match(page,/dialog\.addEventListener\('close'/);assert.match(page,/opener\.focus\(\)/);assert.match(page,/@media \(prefers-reduced-motion: reduce\)/);assert.doesNotMatch(page,/onclick=/);});
