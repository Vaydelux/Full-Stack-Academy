import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.03 Composition and children: valid and edge cases",()=>{
const html=renderToStaticMarkup(createElement(mod.Panel,{title:'Setup'},createElement('p',null,'Child content')));
assert.match(html,/<section aria-label="Setup">/);assert.match(html,/<h2>Setup<\/h2>/);assert.match(html,/<p>Child content<\/p>/);
});
