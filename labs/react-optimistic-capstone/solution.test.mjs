import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.08: Optimistic comments capstone local acceptance",()=>{
const saved=[{id:'a',text:'One',pending:false}];
const first=mod.reconcile(saved,{id:'b',text:'Two',pending:false});
assert.deepEqual(first.map(e=>e.id),['a','b']);
const again=mod.reconcile(first,{id:'b',text:'Updated',pending:false});
assert.equal(again.length,2);assert.equal(again[1].text,'Updated');
assert.equal(saved.length,1);assert.equal(typeof mod.CommentsCapstone,'function');
});
