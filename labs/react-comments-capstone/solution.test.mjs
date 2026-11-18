import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab optimistic comments — real offline contract",async()=>{const list=[{id:'a',text:'Hi'}];assert.deepEqual(solve(list,{id:'b',text:' Hello '},true),[{id:'a',text:'Hi'},{id:'b',text:'Hello'}]);assert.deepEqual(solve(list,{id:'b',text:'fail'},false),list);assert.equal(solve(list,{id:'a',text:'again'},true).length,1);});
test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp("Submit comment"));});
