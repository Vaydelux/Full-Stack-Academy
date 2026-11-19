import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.04 Managing Effect dependencies: local model and SSR contract",()=>{
let connected='';let removed=0;const bus={subscribe:(room,fn)=>{connected=room;fn();return ()=>removed++;}};
const stop=mod.connectRoom('engineering',bus,()=>{});assert.equal(connected,'engineering');stop();assert.equal(removed,1);
connected='';mod.connectRoom('',bus,()=>{});assert.equal(connected,'');
assert.match(renderToStaticMarkup(createElement(mod.RoomFeed,{roomId:'qa',bus})),/Room qa: 0/);
});
