import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Toasts and announcements — pure UI contract",()=>{assert.equal(solve("success"),"status");assert.equal(solve("info"),"status");assert.equal(solve("error"),"alert");});
test('React initial semantic HTML',async()=>{const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {Workshop}=await import(new URL('./'+target+'/Widget.tsx',import.meta.url));const html=renderToStaticMarkup(React.createElement(Workshop));assert.match(html,/<(main|section|article|nav|form)/);assert.match(html,new RegExp("Announcement levels"));});
