import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.03 Persistence risks: real Zustand 5 store contract",()=>{
const memory=new Map();const storage={
 getItem:(key)=>memory.get(key)??null,
 setItem:(key,value)=>{memory.set(key,value);},
 removeItem:(key)=>{memory.delete(key);},
};
const store=mod.makePrefsStore(storage);
store.getState().setToken('PRIVATE_TOKEN');
store.getState().setTheme('dark');
const raw=memory.get('academy-ui-preferences');assert.ok(raw);
const data=JSON.parse(raw);assert.equal(data.state.theme,'dark');
assert.equal('token' in data.state,false);assert.doesNotMatch(raw,/PRIVATE_TOKEN/);
});
