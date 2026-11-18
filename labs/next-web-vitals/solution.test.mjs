import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Core Web Vitals — real offline contract",async()=>{assert.equal(solve(2100,120,0.05),'good');assert.equal(solve(3000,120,0.05),'needs-work');assert.equal(solve(2100,250,0.05),'needs-work');});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/Metrics/);});
