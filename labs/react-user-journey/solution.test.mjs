import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.03 Test user journeys source-level and SSR checks",()=>{
const state={accepted:false,stage:'editing'};
assert.deepEqual(mod.flowReducer(state,{type:'submit'}),state);
const accepted=mod.flowReducer(state,{type:'toggle'});
assert.equal(mod.flowReducer(accepted,{type:'submit'}).stage,'complete');
assert.match(renderToStaticMarkup(createElement(mod.CheckoutFlow)),/disabled=""/);
});
