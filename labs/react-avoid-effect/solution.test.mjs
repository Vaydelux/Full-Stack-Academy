import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.07 Avoiding unnecessary Effects: local model and SSR contract",()=>{
const items=[{id:'1',name:'Ava Smith'},{id:'2',name:'Noel Reed'},{id:'3',name:'Avani'}];
assert.deepEqual(mod.filterDirectory(items,' AVA ').map(x=>x.id),['1','3']);
assert.deepEqual(mod.filterDirectory(items,'nomatch'),[]);
const html=renderToStaticMarkup(createElement(mod.Directory,{items,query:'reed'}));
assert.match(html,/Noel Reed/);assert.doesNotMatch(html,/Ava Smith/);
});
