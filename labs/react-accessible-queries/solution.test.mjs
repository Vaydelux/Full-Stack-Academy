import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.02 Accessible queries source-level and SSR checks",()=>{
const html=renderToStaticMarkup(createElement(mod.SupportSearch,{results:1}));
assert.match(html,/<label for="support-query">Search support<\/label>/);
assert.match(html,/id="support-query"/);assert.match(html,/role="status">1 result/);
});
