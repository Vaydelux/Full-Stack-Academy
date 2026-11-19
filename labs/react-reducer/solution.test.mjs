import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.07 Reducers and state machines: transition and boundary checks",()=>{
const item={id:'1',text:'Review',done:false};
const added=mod.todoReducer([],{type:'add',item});assert.equal(added.length,1);
assert.equal(mod.todoReducer(added,{type:'add',item}),added);
const toggled=mod.todoReducer(added,{type:'toggle',id:'1'});
assert.equal(toggled[0].done,true);assert.equal(added[0].done,false);
assert.deepEqual(mod.todoReducer(toggled,{type:'remove',id:'1'}),[]);
});
