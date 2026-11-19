import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.07 Avoiding duplicated caches: real Zustand 5 store contract",()=>{
const store=mod.makeSelectionStore();
assert.equal('tasks' in store.getState(),false);
const records=[{id:'t1',title:'One'},{id:'t2',title:'Two'}];
store.getState().select('t2');
assert.deepEqual(mod.selectedTask(records,store.getState().selectedId),records[1]);
assert.equal(mod.selectedTask(records,'missing'),null);
});
