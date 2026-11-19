import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.06 Navigation and prefetch offline data contract",()=>{
assert.equal(mod.safeInternalPath('/guides/react'),'/guides/react');
assert.equal(mod.safeInternalPath('https://evil.test/login'),null);
assert.equal(mod.safeInternalPath('//evil.test'),null);
assert.equal(mod.safeInternalPath('javascript:alert(1)'),null);
assert.match(renderToStaticMarkup(createElement(mod.NavPath,{destination:'/docs'})),/\/docs/);
});
