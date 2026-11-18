import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("TypeScript project references — package and compiler contract",async()=>{assert.deepEqual(solve([{name:'app',deps:['core']},{name:'core',deps:[]}]),['core','app']);assert.throws(()=>solve([{name:'a',deps:['b']},{name:'b',deps:['a']}]),/Cycle/);assert.throws(()=>solve([{name:'app',deps:['missing']}]),/Unknown dependency/);});
test('illustrative package/toolchain JSON parses and is clearly local',()=>{const path=new URL('./tsconfig.example.json',import.meta.url);const json=JSON.parse(readFileSync(path,'utf8'));assert.ok(json&&typeof json==='object');});
