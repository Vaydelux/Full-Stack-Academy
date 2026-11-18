import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Task orchestration — offline monorepo policy",()=>{assert.deepEqual(solve([{name:'web',dependsOn:['contracts']},{name:'api',dependsOn:['contracts']},{name:'contracts',dependsOn:[]}]),['contracts','web','api']);assert.throws(()=>solve([{name:'web',dependsOn:['api']},{name:'api',dependsOn:['web']}]),/Cycle/);});
test('checked-in sample configuration is present',()=>{const text=readFileSync(new URL('./turbo.example.json',import.meta.url),'utf8');assert.ok(text.length>40);});
