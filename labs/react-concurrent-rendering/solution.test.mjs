import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.07 Concurrent rendering mental model source-level and SSR checks",()=>{
assert.equal(mod.activityLabel(1),'1 activity');assert.equal(mod.activityLabel(4),'4 activities');assert.throws(()=>mod.activityLabel(-1),RangeError);
assert.match(renderToStaticMarkup(createElement(mod.ActivityPanel)),/0 activities/);
});
