import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.04 Conditional rendering: valid and edge cases",()=>{
assert.match(renderToStaticMarkup(createElement(mod.RequestNotice,{state:'failed'})),/role="alert".*Unable to load/);
assert.match(renderToStaticMarkup(createElement(mod.RequestNotice,{state:'loading'})),/role="status".*Loading/);
assert.match(renderToStaticMarkup(createElement(mod.RequestNotice,{state:'ready'})),/Report is ready/);
});
