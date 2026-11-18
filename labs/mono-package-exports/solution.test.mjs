import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Package boundaries and exports — offline monorepo policy",()=>{const pkg={name:'@academy/contracts',exports:{'.':{types:'./dist/index.d.ts',default:'./dist/index.js'},'./utils':'./dist/utils.js'}};assert.equal(solve(pkg,'.'),'./dist/index.js');assert.equal(solve(pkg,'./utils'),'./dist/utils.js');assert.equal(solve(pkg,'./internal/config'),null);});
test('checked-in sample configuration is present',()=>{const text=readFileSync(new URL('./package.example.json',import.meta.url),'utf8');assert.ok(text.length>40);});
