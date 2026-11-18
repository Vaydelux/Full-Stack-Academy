import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Import organization and type-only imports — package and compiler contract",async()=>{const input=[{name:'Z',id:'2'},{name:'A',id:'1'}];assert.deepEqual(solve(input),['A','Z']);assert.equal(input[0].name,'Z');});
