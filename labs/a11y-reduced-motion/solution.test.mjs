import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("provides a reduced motion media rule and independent pause behavior",()=>{assert.match(page,/@media \(prefers-reduced-motion: reduce\)/);assert.match(page,/\.is-paused \.indicator\{animation:none\}/);assert.match(page,/id="motion-toggle"/);});
test("provides unambiguous visible status and accessible control",()=>{assert.match(page,/Workshop status: ready for practice/);assert.match(page,/id="motion-status" role="status" aria-live="polite"/);assert.match(page,/Pause animation/);assert.match(page,/Resume animation/);});
test("animation is decorative and not essential to understanding",()=>{assert.match(page,/<span class="indicator" aria-hidden="true"><\/span>/);assert.match(page,/\.indicator\{animation:none\}/);});
