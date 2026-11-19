import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.05.06 Build and runtime diagnostics offline boundary checks",()=>{
assert.equal(mod.diagnose('MISSING_ENV'),'configuration');assert.equal(mod.diagnose('TS_ERROR'),'typecheck');assert.equal(mod.diagnose('HYDRATION'),'browser-runtime');assert.equal(mod.diagnose('UNKNOWN'),'needs-investigation');
});
