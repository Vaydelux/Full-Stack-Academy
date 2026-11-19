import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.03: useTransition and responsive interactions local acceptance",()=>{
assert.deepEqual(mod.matchOptions(['React','Redux','Vue'],'re'),['React','Redux']);
assert.deepEqual(mod.matchOptions(['One'],'xyz'),[]);
const html=renderToStaticMarkup(createElement(mod.TransitionSearch,{options:['React','Vue']}));
assert.match(html,/React/);assert.match(html,/Vue/);
});
