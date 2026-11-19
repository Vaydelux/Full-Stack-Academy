import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.01: Context and providers local acceptance",()=>{
const html=renderToStaticMarkup(createElement(mod.ThemeFrame,{mode:'dark'},createElement(mod.ThemeLabel)));
assert.match(html,/Theme: dark/);
assert.throws(()=>renderToStaticMarkup(createElement(mod.ThemeLabel)),/Missing ThemeFrame/);
});
