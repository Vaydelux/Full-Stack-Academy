import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("08.02.03 Combobox and listbox offline model",()=>{
const rows=[{id:'a',label:'React'},{id:'b',label:'Vue'}];assert.deepEqual(mod.filterOptions(rows,'re').map(x=>x.id),['a']);assert.equal(rows.length,2);
});
