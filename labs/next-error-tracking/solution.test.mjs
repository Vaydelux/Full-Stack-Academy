import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Error tracking in practice — real offline contract",async()=>{const e=solve(new Error('FAKE_PASSWORD_VALUE'));assert.equal(JSON.stringify(e).includes('FAKE_PASSWORD_VALUE'),false);assert.deepEqual(e,{publicMessage:'An unexpected error occurred',code:'internal-error'});});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/publicErrorResponse/);});
