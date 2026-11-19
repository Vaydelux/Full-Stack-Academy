import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.01 Server vs Client Components: offline boundary contract",()=>{
assert.equal(mod.detectBoundary("'use client';\nexport function Button(){}"),'client');
assert.equal(mod.detectBoundary("export async function Page(){}"),'server');
assert.match(renderToStaticMarkup(createElement(mod.BoundaryLabel,{source:"export default function Page(){}"})),/>server</);
});
