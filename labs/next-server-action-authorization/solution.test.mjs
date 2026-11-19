import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.04 Server Actions and mutations: offline boundary contract",()=>{
const project={id:'p1',memberIds:['u1']};
assert.equal(mod.canChangeTitle({id:'u1'},project,'Updated'),true);
assert.equal(mod.canChangeTitle({id:'u2'},project,'Updated'),false);
assert.equal(mod.canChangeTitle(null,project,'Updated'),false);
assert.equal(mod.canChangeTitle({id:'u1'},project,' '),false);
});
