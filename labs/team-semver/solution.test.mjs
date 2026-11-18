import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Semantic versioning — policy regression",()=>{assert.equal(solve('1.4.2','breaking'),'2.0.0');assert.equal(solve('1.4.2','feature'),'1.5.0');assert.equal(solve('1.4.2','fix'),'1.4.3');assert.throws(()=>solve('0.5.0','breaking'),RangeError);});
