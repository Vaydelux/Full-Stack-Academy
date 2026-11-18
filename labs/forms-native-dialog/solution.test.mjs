import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("details summary and popover are native discoverable controls",()=>{assert.match(page,/<details><summary>What should I prepare\?<\/summary>/);assert.match(page,/popovertarget="help-popover"/);assert.match(page,/id="help-popover" popover="auto"/);});
test("modal dialog has a name and explicit dismissal",()=>{assert.match(page,/<dialog id="settings-dialog" aria-labelledby="settings-heading">/);assert.match(page,/<h2 id="settings-heading">Workshop preferences<\/h2>/);assert.match(page,/<form method="dialog"><button type="submit">Close settings<\/button><\/form>/);});
test("the modal is opened with native showModal",()=>{assert.match(page,/\.showModal\(\)/);assert.match(page,/id="open-settings"/);assert.doesNotMatch(page,/role="dialog"/);});
