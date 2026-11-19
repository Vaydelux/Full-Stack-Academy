import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.04 Updating arrays and objects: transition and boundary checks",()=>{
const rows=[{id:'a',quantity:1},{id:'b',quantity:2}];
const next=mod.setQuantity(rows,'a',5);
assert.equal(rows[0].quantity,1);assert.equal(next[0].quantity,5);
assert.notEqual(next,rows);assert.notEqual(next[0],rows[0]);assert.equal(next[1],rows[1]);
assert.throws(()=>mod.setQuantity(rows,'a',-1),RangeError);
assert.match(renderToStaticMarkup(createElement(mod.QuantityList,{rows:next})),/a: 5/);
});
