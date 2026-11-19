import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.06 Lifting state up: transition and boundary checks",()=>{
const html=renderToStaticMarkup(createElement(mod.TextComposer,{initial:'Hello'}));
assert.match(html,/id="composer"/);assert.match(html,/value="Hello"/);
assert.match(html,/aria-label="Preview">Hello/);
assert.match(renderToStaticMarkup(createElement(mod.TextComposer,{initial:''})),/Empty message/);
});
