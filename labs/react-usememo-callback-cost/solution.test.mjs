import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.06 useMemo and useCallback tradeoffs source-level and SSR checks",()=>{
const original=['TypeScript','React','Next.js'];
const selected=mod.selectCourses(original,'react');
assert.deepEqual(selected,['React']);assert.deepEqual(original,['TypeScript','React','Next.js']);
assert.deepEqual(mod.selectCourses(original,''),['Next.js','React','TypeScript']);
assert.match(renderToStaticMarkup(createElement(mod.CoursePicker,{courses:original})),/Next.js/);
});
