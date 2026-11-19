import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.08 Lab public site offline data contract",()=>{
assert.deepEqual(mod.findProduct('starter-kit'),{slug:'starter-kit',title:'Starter kit'});
assert.equal(mod.findProduct('../private'),null);
assert.equal(mod.findProduct('not-real'),null);
const html=renderToStaticMarkup(createElement(mod.Catalogue));assert.match(html,/Starter kit/);assert.match(html,/UI handbook/);
});
