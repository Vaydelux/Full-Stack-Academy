import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.08 Lab filters and preferences: real Zustand 5 store contract",()=>{
const store=mod.createAcademyFilterStore();
const rows=[{id:'r',label:'React Essentials',type:'course'},{id:'z',label:'Zod Reference',type:'reference'},{id:'n',label:'Next Routing',type:'course'}];
store.getState().setQuery('rea');store.getState().setKind('course');
assert.deepEqual(mod.selectVisible(rows,store.getState()).map(row=>row.id),['r']);
store.getState().setDensity('compact');assert.equal(store.getState().density,'compact');
store.getState().reset();assert.equal(store.getState().query,'');assert.equal(store.getState().kind,'all');assert.equal(mod.selectVisible(rows,store.getState()).length,3);
});
