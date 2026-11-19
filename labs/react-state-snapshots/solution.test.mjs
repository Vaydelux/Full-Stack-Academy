import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.01 useState and state snapshots: transition and boundary checks",()=>{
assert.equal(mod.increment(4),5);assert.equal(mod.increment(-1),0);
const html=renderToStaticMarkup(createElement(mod.SnapshotCounter,{initial:4}));
assert.match(html,/Count: 4/);assert.match(html,/type="button"/);
});
