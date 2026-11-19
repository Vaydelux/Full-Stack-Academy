import assert from 'node:assert/strict';
import test from 'node:test';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.ts');
test("09.04.05 Multi-tab state coordination: real Zustand 5 store contract",()=>{
const tab=mod.makeTabStore('tab-a');
tab.getState().setTheme('dark');assert.equal(tab.getState().revision,1);
tab.getState().applyRemote({origin:'tab-b',revision:0,theme:'light'});assert.equal(tab.getState().theme,'dark');
tab.getState().applyRemote({origin:'tab-a',revision:99,theme:'light'});assert.equal(tab.getState().theme,'dark');
tab.getState().applyRemote({origin:'tab-b',revision:2,theme:'light'});assert.equal(tab.getState().theme,'light');assert.equal(tab.getState().revision,2);
});
