import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Public package API design — package and compiler contract",async()=>{assert.equal(solve('.'),'./dist/index.js');assert.equal(solve('./types'),'./dist/types.js');assert.equal(solve('./internal/config'),null);});
test('illustrative package/toolchain JSON parses and is clearly local',()=>{const path=new URL('./package.example.json',import.meta.url);const json=JSON.parse(readFileSync(path,'utf8'));assert.ok(json&&typeof json==='object');});
