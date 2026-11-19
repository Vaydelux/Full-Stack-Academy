import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.04 Loading and error boundaries offline data contract",()=>{
assert.match(renderToStaticMarkup(createElement(mod.SegmentNotice,{state:'loading'})),/role="status"/);
assert.match(renderToStaticMarkup(createElement(mod.SegmentNotice,{state:'error'})),/role="alert"/);
assert.match(renderToStaticMarkup(createElement(mod.SegmentNotice,{state:'ready'})),/Lesson ready/);
});
