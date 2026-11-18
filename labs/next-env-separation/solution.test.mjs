import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Environment separation — real offline contract",async()=>{assert.equal(solve('INTERNAL_API_KEY'),true);assert.equal(solve('NEXT_PUBLIC_SITE_URL'),false);assert.throws(()=>solve('../FAKE'));});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/INTERNAL_API_KEY/);});
