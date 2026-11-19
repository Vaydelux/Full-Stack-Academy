import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.01 Render purity and deterministic components: local model and SSR contract",()=>{
assert.equal(mod.memberLabel(1),'1 member');assert.equal(mod.memberLabel(4),'4 members');
assert.throws(()=>mod.memberLabel(-1),RangeError);
assert.match(renderToStaticMarkup(createElement(mod.MemberSummary,{count:4})),/>4 members</);
});
