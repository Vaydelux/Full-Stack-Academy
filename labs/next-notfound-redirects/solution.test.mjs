import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.05 Not-found and redirects offline data contract",()=>{
assert.deepEqual(mod.decideGuide('react'),{kind:'render',slug:'react'});
assert.deepEqual(mod.decideGuide('old-react'),{kind:'redirect',to:'/guides/react'});
assert.deepEqual(mod.decideGuide('unknown'),{kind:'notFound'});
});
