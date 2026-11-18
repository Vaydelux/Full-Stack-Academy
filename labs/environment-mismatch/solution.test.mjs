import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('reports three independent environment blockers',()=>{const req={nodeMajor:24,manager:'npm',files:['package-lock.json'],variables:['APP_MODE']};const actual={nodeVersion:'v22.9.0',manager:'pnpm',files:[],environment:{APP_MODE:'test',PRIVATE_TOKEN:'never-log'}};assert.deepEqual(api.diagnoseEnvironment(req,actual),{ready:false,issues:['node-major','package-manager','missing-file:package-lock.json']});});
test('accepts corrected environment without exposing values',()=>{const req={nodeMajor:24,manager:'npm',files:['package-lock.json'],variables:['APP_MODE']};const actual={nodeVersion:'v24.1.0',manager:'npm',files:['package-lock.json'],environment:{APP_MODE:'test',PRIVATE_TOKEN:'very-private'}};const result=api.diagnoseEnvironment(req,actual);assert.deepEqual(result,{ready:true,issues:[]});assert.doesNotMatch(JSON.stringify(result),/very-private|test/);});
test('reports missing variable by name only',()=>{const req={nodeMajor:24,manager:'npm',files:[],variables:['APP_MODE']};assert.deepEqual(api.diagnoseEnvironment(req,{nodeVersion:'v24.0.0',manager:'npm',files:[],environment:{}}).issues,['missing-variable:APP_MODE']);});
