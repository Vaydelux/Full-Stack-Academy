import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Review comments and rationale — policy regression",()=>{const reviewed=solve({file:'src/api.ts',line:14,symptom:'timeout not handled',impact:'request hangs',proposal:'abort at 3s'});assert.deepEqual(reviewed,{location:'src/api.ts:14',comment:'Observed: timeout not handled Impact: request hangs Suggested change: abort at 3s'});assert.equal(solve({file:'src/api.ts',line:14,symptom:'',impact:'bad',proposal:'fix'}),null);});
