import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.04.03 Form accessibility local QA contract",()=>{
assert.deepEqual(mod.fieldAria('email','Required'),{'aria-invalid':true,'aria-describedby':'email-error'});assert.deepEqual(mod.fieldAria('email',null),{'aria-invalid':false,'aria-describedby':undefined});
});
