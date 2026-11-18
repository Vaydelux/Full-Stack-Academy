import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("controls have accessible labels and names",()=>{assert.match(page,/<label for="display-name">Display name<\/label>/);assert.match(page,/name="displayName" required/);assert.match(page,/<label for="session-mode">Session mode<\/label>/);assert.match(page,/id="session-mode" name="mode"/);});
test("input change and submit events are observed",()=>{for(const type of ['input','change','submit'])assert.match(page,new RegExp("addEventListener\\('"+type+"'"));assert.match(page,/event\.preventDefault\(\)/);});
test("no raw input value is logged or sent",()=>{assert.match(page,/Local submission prevented; no data sent\./);assert.match(page,/type="button" id="clear-log"/);assert.doesNotMatch(page,/console\.log\(.*value|status\.textContent=.*\.value/);});
