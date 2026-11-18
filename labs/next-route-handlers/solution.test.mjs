import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Route handlers and BFF — real offline contract",async()=>{assert.equal(solve('sku-1'),'/api/products/sku-1');assert.throws(()=>solve('https://127.0.0.1/admin'));assert.throws(()=>solve('../escape'));});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/GET/);});
