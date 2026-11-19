import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.08 Bug Hunt: stale closure: transition and boundary checks",()=>{
const queue=[];mod.enqueueTwice(updater=>queue.push(updater));
assert.equal(queue.length,2);assert.equal(queue.reduce((v,updater)=>updater(v),5),7);
assert.match(renderToStaticMarkup(createElement(mod.BurstCounter)),/Score: 0/);
});
