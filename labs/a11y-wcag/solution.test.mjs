import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("the four POUR dimensions are separate named checkboxes",()=>{for(const value of ['perceivable','operable','understandable','robust'])assert.match(page,new RegExp('name="pour" value="'+value+'"'));assert.equal((page.match(/type="checkbox" name="pour"/g)||[]).length,4);assert.match(page,/<fieldset><legend>Preliminary page review<\/legend>/);});
test("the output identifies its limited self-assessment scope",()=>{assert.match(page,/Not a conformance audit/);assert.match(page,/id="result" role="status" aria-live="polite"/);assert.doesNotMatch(page,/100% compliant|WCAG certified/i);});
test("links to the normative WCAG text",()=>{assert.match(page,/https:\/\/www\.w3\.org\/TR\/WCAG22\//);assert.match(page,/id="summarize"/);});
