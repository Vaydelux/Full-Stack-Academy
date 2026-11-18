import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Private data and cache risks — real offline contract",async()=>{assert.notEqual(solve('t1','u1','/orders'),solve('t1','u2','/orders'));assert.notEqual(solve('t1','u1','/orders'),solve('t2','u1','/orders'));assert.throws(()=>solve('','u1','/orders'));});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/cookies/);});
