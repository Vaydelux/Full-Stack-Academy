import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.07 Event handlers: valid and edge cases",()=>{
let calls=0;const handler=()=>{calls++};
const element=mod.SelectionButton({selected:false,onToggle:handler});
assert.equal(calls,0);assert.equal(element.props['aria-pressed'],false);assert.equal(element.props.type,'button');
element.props.onClick();assert.equal(calls,1);
assert.match(renderToStaticMarkup(createElement(mod.SelectionButton,{selected:true,onToggle:handler})),/aria-pressed="true"/);
});
