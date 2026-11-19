import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.06 DOM refs and accessible focus: local model and SSR contract",()=>{
let called=0;assert.equal(mod.focusNode({focus:()=>called++}),true);assert.equal(called,1);
assert.equal(mod.focusNode(null),false);
const html=renderToStaticMarkup(createElement(mod.FocusSearch));
assert.match(html,/id="focus-search"/);assert.match(html,/Focus input/);
});
