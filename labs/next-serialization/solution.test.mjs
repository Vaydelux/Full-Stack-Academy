import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Serialization boundaries — real offline contract",async()=>{const safe=solve({id:'1',displayName:' Ada ',secret:'FAKE_DEMO'});assert.deepEqual(safe,{id:'1',displayName:'Ada'});assert.equal('secret' in safe,false);});
test('illustrative Next.js sample exists outside the active app router',()=>{const example=readFileSync(new URL('./example.tsx',import.meta.url),'utf8');assert.ok(example.length>65);assert.match(example,/PublicBadge/);});
