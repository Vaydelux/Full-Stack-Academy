import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.01 Project structure and route segments offline data contract",()=>{
assert.equal(mod.routeFromSegments(['(marketing)','products','page.tsx']),'/products');
assert.equal(mod.routeFromSegments(['guides','nextjs','page.tsx']),'/guides/nextjs');
assert.match(renderToStaticMarkup(createElement(mod.RouteNotice,{parts:['(docs)','guide','page.tsx']})),/\/guide/);
});
