import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.01 React Testing Library source-level and SSR checks",()=>{
const html=renderToStaticMarkup(createElement(mod.AnnouncementButton));
assert.match(html,/aria-pressed="false"/);assert.match(html,/role="status"/);assert.match(html,/Notice disabled/);
});
