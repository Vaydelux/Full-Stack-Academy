import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("useOptimistic in practice — real offline contract",async()=>{const base=[{id:'a',text:'Hello'}];const pending={id:'b',text:'World'};assert.equal(solve(base,pending,false).length,1);assert.equal(solve(base,pending,true).length,2);});
test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp("Add comment"));});
