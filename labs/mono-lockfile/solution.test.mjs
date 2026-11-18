import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lockfile discipline — offline monorepo policy",()=>{const manifest={dependencies:{react:'19.0.0'},devDependencies:{typescript:'5.9.0'}};assert.equal(solve(manifest,{react:'19.0.0',typescript:'5.9.0'}),true);assert.equal(solve(manifest,{react:'18.0.0',typescript:'5.9.0'}),false);assert.equal(solve(manifest,{react:'19.0.0'}),false);});
