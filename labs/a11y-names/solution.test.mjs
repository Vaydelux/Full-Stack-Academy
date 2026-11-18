import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("explicitly labels and describes the input",()=>{assert.match(page,/<label for="keyword">Workshop keyword<\/label>/);assert.match(page,/id="keyword" name="keyword" aria-describedby="keyword-hint" required/);assert.match(page,/id="keyword-hint"/);});
test("icon-only action has a distinct accessible name",()=>{assert.match(page,/<button type="button" id="add-topic" aria-label="Add workshop topic"><span aria-hidden="true">\+<\/span><\/button>/);});
test("status is clear and no raw field contents are logged",()=>{assert.match(page,/id="result" role="status" aria-live="polite"/);assert.match(page,/Topic added to local preview only/);assert.doesNotMatch(page,/console\.log\(.*value/);});
