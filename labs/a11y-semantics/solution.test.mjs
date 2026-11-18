import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const page=readFileSync(new URL(`./${target}/index.html`,import.meta.url),'utf8');
test("uses native navigable regions and a named navigation",()=>{for(const tag of ['header','nav','main','aside','footer'])assert.match(page,new RegExp('<'+tag+'\\b'));assert.match(page,/<nav aria-label="Resource navigation">/);assert.equal((page.match(/<main\b/g)||[]).length,1);});
test("has a useful h1 and labeled sections",()=>{assert.match(page,/<h1>Workshop resources<\/h1>/);assert.match(page,/aria-labelledby="guide-title"/);assert.match(page,/aria-labelledby="questions-title"/);});
test("updates routine feedback via status and native button",()=>{assert.match(page,/id="progress" role="status" aria-live="polite"/);assert.match(page,/id="review"/);assert.match(page,/Guide reviewed locally\. Nothing saved\./);assert.doesNotMatch(page,/role="alert"/);});
