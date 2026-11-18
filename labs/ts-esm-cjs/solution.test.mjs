import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("ESM and CommonJS interoperability — package and compiler contract",async()=>{assert.equal(solve('index.mjs'),'esm');assert.equal(solve('legacy.cjs'),'cjs');assert.equal(solve('index.js','commonjs'),'cjs');assert.equal(solve('index.ts'),null);});
