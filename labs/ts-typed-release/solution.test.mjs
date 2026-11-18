import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Lab typed package release — package and compiler contract",async()=>{assert.deepEqual(solve({name:'@academy/core',version:'1.0.0',exports:['./dist/index.js']}),{ok:true,entry:'./dist/index.js'});assert.deepEqual(solve({name:'@academy/core',version:'dev',exports:[]}),{ok:false,error:'invalid-manifest'});assert.deepEqual(solve(null),{ok:false,error:'invalid-manifest'});});
test('illustrative package/toolchain JSON parses and is clearly local',()=>{const path=new URL('./package.example.json',import.meta.url);const json=JSON.parse(readFileSync(path,'utf8'));assert.ok(json&&typeof json==='object');});
