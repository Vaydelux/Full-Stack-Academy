import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.03.06 Optimistic table interactions data/UX contract",()=>{
const rows=[{id:'a',status:'open'},{id:'b',status:'open'}];const out=mod.updateRow(rows,'b','closed');assert.deepEqual(out,[{id:'a',status:'open'},{id:'b',status:'closed'}]);assert.equal(rows[1].status,'open');assert.deepEqual(mod.updateRow(rows,'x','closed'),rows);
});
