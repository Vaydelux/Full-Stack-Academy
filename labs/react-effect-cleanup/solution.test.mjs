import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.03.03 Effect cleanup and resource lifetime: local model and SSR contract",()=>{
const active=[];const stopped=[];let ticks=0;
const cleanup=mod.startHeartbeat({start:(fn,ms)=>{assert.equal(ms,1000);active.push(fn);return 42;},stop:id=>stopped.push(id)},()=>ticks++);
active[0]();assert.equal(ticks,1);cleanup();assert.deepEqual(stopped,[42]);
assert.match(renderToStaticMarkup(createElement(mod.Heartbeat)),/Ticks: 0/);
});
