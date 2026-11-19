import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.02.05 Component state preservation: transition and boundary checks",()=>{
const person={id:'p-9',name:'Ava'};
const element=mod.ProfileSwitcher({person});
assert.equal(element.props.children[1].key,'p-9');
const html=renderToStaticMarkup(createElement(mod.ProfileSwitcher,{person}));
assert.match(html,/<h2>Ava<\/h2>/);assert.match(html,/value="Ava"/);
});
