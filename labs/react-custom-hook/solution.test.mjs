import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.02: Reusable custom Hooks local acceptance",()=>{
assert.equal(mod.inverted(false),true);assert.equal(mod.inverted(true),false);
const html=renderToStaticMarkup(createElement(mod.Disclosure));
assert.match(html,/aria-expanded="false"/);
});
