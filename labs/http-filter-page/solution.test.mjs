import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs');
test("10.02.05 Filtering, sorting and pagination: HTTP contract acceptance",async()=>{
const rows=[{id:1,title:'Zebra',status:'done'},{id:2,title:'Beta',status:'open'},{id:3,title:'Alpha',status:'open'}];
assert.deepEqual(mod.listTasks(rows,{status:'open',page:1,limit:2}).map(x=>x.title),['Alpha','Beta']);
assert.deepEqual(mod.listTasks(rows,{status:'open',page:2,limit:1}).map(x=>x.title),['Beta']);
assert.throws(()=>mod.listTasks(rows,{status:'all',page:0,limit:2}),/Invalid page/);
assert.deepEqual(rows.map(x=>x.title),['Zebra','Beta','Alpha']);
});
