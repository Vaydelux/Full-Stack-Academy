import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.05: useOptimistic and pending UI local acceptance",()=>{
const seed=[{id:'1',text:'First',pending:false}],item={id:'2',text:'Second',pending:true};
const result=mod.optimisticAppend(seed,item);assert.deepEqual(result,[...seed,item]);
assert.deepEqual(seed,[{id:'1',text:'First',pending:false}]);assert.notEqual(result,seed);
assert.equal(typeof mod.OptimisticComments,'function');
});
