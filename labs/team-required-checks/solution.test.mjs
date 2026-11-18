import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("CI status checks — policy regression",()=>{const checks=[{name:'tests',sha:'old',status:'success'},{name:'tests',sha:'new',status:'success'},{name:'audit',sha:'new',status:'pending'}];assert.equal(solve(['tests','audit'],checks,'new'),false);assert.equal(solve(['tests'],checks,'new'),true);assert.equal(solve(['tests'],[{name:'tests',sha:'old',status:'success'}],'new'),false);});
