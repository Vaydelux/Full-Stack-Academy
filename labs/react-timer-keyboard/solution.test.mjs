import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.08 Reliable timer and keyboard shortcuts capstone: local model and SSR contract",()=>{
assert.equal(mod.formatClock(0),'00:00');assert.equal(mod.formatClock(65),'01:05');assert.throws(()=>mod.formatClock(-1),RangeError);
const basic={key:' ',ctrlKey:false,altKey:false,metaKey:false};
assert.equal(mod.shouldToggle(basic),true);assert.equal(mod.shouldToggle({...basic,targetTag:'INPUT'}),false);
assert.equal(mod.shouldToggle({...basic,ctrlKey:true}),false);
assert.equal(mod.shouldToggle({...basic,targetTag:'BUTTON'}),false);
assert.equal(mod.shouldToggle({...basic,editable:true}),false);
assert.equal(mod.shouldToggle({...basic,repeat:true}),false);
assert.equal(mod.shouldToggle({...basic,defaultPrevented:true}),false);
assert.match(renderToStaticMarkup(createElement(mod.TimerKeyboard)),/00:00/);
});
