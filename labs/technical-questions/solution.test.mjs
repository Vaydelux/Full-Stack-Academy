import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('formats actionable steps and expected/actual outcome',()=>{const text=api.formatBugReport({title:'Projects fail',environment:'Node 24',steps:['Start server','GET /api/projects'],expected:'200',actual:'404',evidence:'request demo'});assert.match(text,/1\. Start server/);assert.match(text,/## Expected\n200/);assert.match(text,/## Actual\n404/);});
test('rejects incomplete reports',()=>{assert.throws(()=>api.formatBugReport({title:'x',environment:'local',steps:[],expected:'200',actual:'404',evidence:'log'}));});
test('redacts common secrets before formatting',()=>{const text=api.formatBugReport({title:'Auth error',environment:'Node 24',steps:['Bearer 123secret'],expected:'200',actual:'401',evidence:'token=123secret password: private'});assert.doesNotMatch(text,/123secret|private/);assert.match(text,/REDACTED/);});
