import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.03 Derived state versus duplicated state: transition and boundary checks",()=>{
const items=[{id:'a',price:12.5,quantity:2},{id:'b',price:4,quantity:3}];
assert.equal(mod.cartTotal(items),37);assert.equal(mod.cartTotal([]),0);
assert.throws(()=>mod.cartTotal([{id:'bad',price:10,quantity:-1}]),RangeError);
assert.match(renderToStaticMarkup(createElement(mod.CartSummary,{items})),/37\.00/);
});
