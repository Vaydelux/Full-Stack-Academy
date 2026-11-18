import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab SEO audit in practice — real offline contract",async()=>{assert.deepEqual(solve({published:true,title:'React',canonical:'https://academy.example/react'}),{index:true,issues:[]});const invalid=solve({published:false,title:'',canonical:'/relative'});assert.equal(invalid.index,false);assert.equal(invalid.issues.length,3);});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/robots/);});
