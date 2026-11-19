import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.02 useEffect for external synchronization: local model and SSR contract",()=>{
let width=320;let listener=()=>{};let stopped=0;const observed=[];
const stop=mod.watchWidth({read:()=>width,subscribe:cb=>{listener=cb;return ()=>stopped++;}},w=>observed.push(w));
width=720;listener();stop();assert.deepEqual(observed,[320,720]);assert.equal(stopped,1);
assert.match(renderToStaticMarkup(createElement(mod.WidthNotice)),/Width: 0/);
});
