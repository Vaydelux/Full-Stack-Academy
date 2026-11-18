import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("ESLint rules and safe typing — package and compiler contract",async()=>{assert.equal(solve({id:'abc'}),'ABC');assert.equal(solve({id:2}),'INVALID');assert.equal(solve(null),'INVALID');});
test('illustrative package/toolchain JSON parses and is clearly local',()=>{const path=new URL('./eslint-policy.example.json',import.meta.url);const json=JSON.parse(readFileSync(path,'utf8'));assert.ok(json&&typeof json==='object');});
