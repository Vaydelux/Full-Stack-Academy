import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab publish and revalidate — real offline contract",async()=>{assert.deepEqual(solve({title:' ',published:false}),{published:false,invalidate:[]});assert.deepEqual(solve({title:'React',published:false}),{published:true,invalidate:['catalog:academy']});});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/updateTag/);});
