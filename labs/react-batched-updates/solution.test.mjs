import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.02 Batching and functional updates: transition and boundary checks",()=>{
assert.equal(mod.addTwo(0),2);assert.equal(mod.addTwo(8),10);
assert.match(renderToStaticMarkup(createElement(mod.BatchingCounter,{initial:8})),/Count: 8/);
});
