import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Sitemap and robots — real offline contract",async()=>{assert.deepEqual(solve([{id:'06.01.01',published:true},{id:'06.01.02',published:false}]),['/learn/06.01.01']);assert.deepEqual(solve([{id:'../bad',published:true}]),[]);});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/MetadataRoute/);});
