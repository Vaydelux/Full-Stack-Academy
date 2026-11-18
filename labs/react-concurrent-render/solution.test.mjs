import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Concurrent rendering mental model — real offline contract",async()=>{assert.equal(solve(1,2),1);assert.equal(solve(0,10),0);});
test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp("current snapshot"));});
