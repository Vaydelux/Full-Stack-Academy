import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.01 TanStack Table columns data/UX contract",()=>{
assert.deepEqual(mod.visibleColumns(['id','privateKey','name','status']),['id','name','status']);assert.deepEqual(mod.visibleColumns(['privateKey']),[]);
});
