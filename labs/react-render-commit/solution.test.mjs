import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.06 Rendering versus DOM commits: valid and edge cases",()=>{
assert.equal(mod.formatCount(1),'1 notification');assert.equal(mod.formatCount(2),'2 notifications');
assert.throws(()=>mod.formatCount(-1),RangeError);
assert.match(renderToStaticMarkup(createElement(mod.NotificationSummary,{count:2})),/aria-live="polite".*2 notifications/);
});
