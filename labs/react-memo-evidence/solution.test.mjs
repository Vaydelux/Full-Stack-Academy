import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.05 React.memo when warranted source-level and SSR checks",()=>{
const a={id:'x',name:'Coffee',price:12},b={...a,price:15};
assert.equal(mod.equalProduct(a,a),true);assert.equal(mod.equalProduct(a,b),false);
assert.equal(mod.equalProduct(a,{...a,name:'Tea'}),false);
assert.match(renderToStaticMarkup(createElement(mod.ProductCard,{product:a})),/Coffee/);
});
