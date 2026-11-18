import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Updating arrays and objects — real offline contract",async()=>{const old=[{id:'a',qty:1},{id:'b',qty:3}];const out=solve(old,'a',5);assert.deepEqual(out,[{id:'a',qty:5},{id:'b',qty:3}]);assert.equal(old[0].qty,1);assert.notEqual(out,old);});
test('actual React component renders meaningful initial HTML',async()=>{const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|form|div)/);assert.match(html,new RegExp("Increase quantity"));});
