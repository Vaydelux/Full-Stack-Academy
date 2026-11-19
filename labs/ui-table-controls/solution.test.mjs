import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Sorting filtering and pagination — pure UI contract",()=>{const items=[{id:"b",title:"React"},{id:"a",title:"Next"},{id:"c",title:"React"}];assert.deepEqual(solve(items,"react",0,2).map(x=>x.id),["b","c"]);assert.deepEqual(solve(items,"react",1,2),[]);assert.throws(()=>solve(items,"",0,0));});
test('React initial semantic HTML',async()=>{const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|nav|form)/);assert.match(html,new RegExp("Task explorer"));});
