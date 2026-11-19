import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.01.01 Tailwind v4 configuration local fixture",()=>{
assert.equal(mod.hasV4Entry('@import "tailwindcss";'),true);assert.equal(mod.hasV4Entry('@tailwind base;'),false);
});
