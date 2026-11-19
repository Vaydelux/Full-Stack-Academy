import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.05 Route handlers and BFF: offline boundary contract",()=>{
assert.equal(mod.parsePageSize(null),20);assert.equal(mod.parsePageSize('50'),50);
assert.equal(mod.parsePageSize('999'),null);assert.equal(mod.parsePageSize('0'),null);
assert.equal(mod.parsePageSize('-1'),null);assert.equal(mod.parsePageSize('oops'),null);
});
