import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab operational console — pure UI contract",()=>{const rows=[{id:"1",tenant:"t1",title:"Task A"},{id:"2",tenant:"t2",title:"Private B"}];assert.deepEqual(solve(rows,"t1"),[rows[0]]);assert.throws(()=>solve(rows,""));assert.throws(()=>solve([{id:"x",tenant:"t1",title:"A"},{id:"x",tenant:"t1",title:"B"}],"t1"));});
test('React initial semantic HTML',async()=>{const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|nav|form)/);assert.match(html,new RegExp("Operations overview"));});
