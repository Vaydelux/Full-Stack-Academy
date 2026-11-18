import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Shared TS config — offline monorepo policy",()=>{const base={strict:true,noUncheckedIndexedAccess:true,target:'ES2022'};assert.deepEqual(solve(base,{target:'ES2023'}),{strict:true,noUncheckedIndexedAccess:true,target:'ES2023'});assert.throws(()=>solve(base,{strict:false}),/Unsafe override/);});
test('checked-in sample configuration is present',()=>{const text=readFileSync(new URL('./tsconfig.base.json',import.meta.url),'utf8');assert.ok(text.length>40);});
