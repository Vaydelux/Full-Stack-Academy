import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.04: useDeferredValue for expensive views local acceptance",()=>{
assert.deepEqual(mod.searchNames(['Anna','Noel','Anika'],' an '),['Anna','Anika']);
assert.deepEqual(mod.searchNames(['Anna'],'zzz'),[]);
const html=renderToStaticMarkup(createElement(mod.DeferredSearch,{names:['Anna','Noel']}));
assert.match(html,/Anna/);assert.match(html,/Noel/);
});
