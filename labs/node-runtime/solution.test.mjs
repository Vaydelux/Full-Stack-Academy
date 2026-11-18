import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('detects independent host capabilities',()=>{assert.deepEqual(api.inspectRuntime({process:{versions:{node:'24.0.0'}},fetch(){}}),{node:true,dom:false,fetch:true,nodeVersion:'24.0.0'});assert.deepEqual(api.inspectRuntime({document:{createElement(){}},fetch(){}}),{node:false,dom:true,fetch:true,nodeVersion:null});});
test('unknown and actual host are handled',()=>{assert.deepEqual(api.inspectRuntime({}),{node:false,dom:false,fetch:false,nodeVersion:null});assert.equal(api.inspectRuntime().node,true);assert.equal(api.inspectRuntime().dom,false);});
