import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab reliable timer and keyboard shortcut — real offline contract",async()=>{assert.deepEqual(solve({running:false,seconds:0},'tick'),{running:false,seconds:0});assert.deepEqual(solve({running:true,seconds:0},'tick'),{running:true,seconds:1});});
test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp("Reliable timer"));});
