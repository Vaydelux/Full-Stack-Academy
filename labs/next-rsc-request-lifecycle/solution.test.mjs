import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.02 RSC request lifecycle: offline boundary contract",()=>{
assert.deepEqual(mod.renderPhases(),['request','server-data','rsc','html','hydrate']);
assert.ok(mod.renderPhases().indexOf('rsc')<mod.renderPhases().indexOf('hydrate'));
});
