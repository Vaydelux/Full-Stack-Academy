import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("tsconfig references and module resolution — package and compiler contract",async()=>{assert.equal(solve({module:'NodeNext',moduleResolution:'NodeNext'}),true);assert.equal(solve({module:'NodeNext',moduleResolution:'Bundler'}),false);assert.equal(solve({module:'ESNext',moduleResolution:'Bundler'}),true);});
test('illustrative package/toolchain JSON parses and is clearly local',()=>{const path=new URL('./tsconfig.example.json',import.meta.url);const json=JSON.parse(readFileSync(path,'utf8'));assert.ok(json&&typeof json==='object');});
