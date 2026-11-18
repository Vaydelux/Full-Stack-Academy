import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("pnpm workspace layout — offline monorepo policy",()=>{const paths=['apps/web/package.json','apps/web/README.md','apps/api/package.json','packages/contracts/package.json','notes/package.json','apps/nested/tool/package.json'];assert.deepEqual(solve(paths),['apps/api','apps/web','packages/contracts']);assert.deepEqual(solve([]),[]);});
test('checked-in sample configuration is present',()=>{const text=readFileSync(new URL('./pnpm-workspace.yaml',import.meta.url),'utf8');assert.match(text,/apps\/\*/);assert.match(text,/packages\/\*/);});
