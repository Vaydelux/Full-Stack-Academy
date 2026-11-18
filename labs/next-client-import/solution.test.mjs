import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Bug Hunt accidental client import — real offline contract",async()=>{assert.deepEqual(solve(['server/secrets','ui/Button','lib/private/db']),['ui/Button']);assert.deepEqual(solve(['ui/Card']),['ui/Card']);});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/use client/);});
