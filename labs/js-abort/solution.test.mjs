import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("AbortController and cancellation — deterministic async behavior",async()=>{
const c=new AbortController();assert.equal(await solve(c.signal,async()=>5),5);const d=new AbortController();d.abort(new Error('stopped'));let called=false;await assert.rejects(()=>solve(d.signal,()=>{called=true;}),/stopped/);assert.equal(called,false);const e=new AbortController();let finish;const pending=solve(e.signal,()=>new Promise(resolve=>{finish=resolve;}));await Promise.resolve();e.abort(new Error('cancelled'));await assert.rejects(()=>pending,/cancelled/);finish?.(42);
});
