import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Branded IDs and validation — validated runtime boundary",()=>{assert.equal(solve('usr_abc'),'usr_abc');assert.equal(solve('project_abc'),null);assert.equal(solve('usr_'),null);assert.equal(solve('usr_123456'), 'usr_123456');});
