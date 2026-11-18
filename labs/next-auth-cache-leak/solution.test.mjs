import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Bug Hunt auth cache leak — real offline contract",async()=>{assert.notEqual(solve('t1','u1','/reports'),solve('t1','u2','/reports'));assert.notEqual(solve('t1','u1','/reports'),solve('t2','u1','/reports'));assert.throws(()=>solve('','u1','/reports'));});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/no-store/);});
