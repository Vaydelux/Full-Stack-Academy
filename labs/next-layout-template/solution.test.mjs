import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.02 Layouts, pages and templates offline data contract",()=>{
const html=renderToStaticMarkup(createElement(mod.PortalShell,null,createElement('p',null,'Current lesson')));
assert.match(html,/aria-label="Main navigation"/);assert.match(html,/<main><p>Current lesson<\/p><\/main>/);
});
