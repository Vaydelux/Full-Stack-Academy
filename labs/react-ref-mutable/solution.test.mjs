import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.05 useRef and mutable values outside render: local model and SSR contract",()=>{
const r={current:0};assert.deepEqual([mod.nextSequence(r),mod.nextSequence(r),mod.nextSequence(r)],[1,2,3]);
assert.equal(mod.nextSequence({current:10}),11);
assert.match(renderToStaticMarkup(createElement(mod.SequenceButton)),/Sequence: 0/);
});
