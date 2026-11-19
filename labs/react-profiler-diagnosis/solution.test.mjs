import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.04 React DevTools profiler source-level and SSR checks",()=>{
assert.deepEqual(mod.summarizeRenders([1.5,2.5]),{count:2,totalMs:4});
assert.throws(()=>mod.summarizeRenders([-1]),RangeError);
assert.equal(typeof mod.ProfiledSection,'function');
});
