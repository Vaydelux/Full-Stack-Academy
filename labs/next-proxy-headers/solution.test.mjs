import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Reverse proxy and headers — real offline contract",async()=>{assert.deepEqual(solve({}) ,{'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});assert.equal(solve({'Cache-Control':'private'})['Cache-Control'],'private');});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/proxy/);});
