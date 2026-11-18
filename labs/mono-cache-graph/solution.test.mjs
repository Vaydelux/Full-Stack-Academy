import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Build graph and cache — offline monorepo policy",()=>{const base={source:'a',lockfile:'lock1',tsconfig:'strict',dependencies:'contracts-hash'};const key=solve(base);assert.equal(key,solve({...base}));assert.notEqual(key,solve({...base,tsconfig:'relaxed'}));assert.notEqual(key,solve({...base,dependencies:'changed'}));assert.equal(key.length,64);});
