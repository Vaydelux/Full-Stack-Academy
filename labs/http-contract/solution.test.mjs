import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
const req=(path,init)=>new Request('http://localhost'+path,init);
test('GET and unknown paths have accurate statuses',async()=>{const ok=await api.handle(req('/api/tasks'));assert.equal(ok.status,200);assert.deepEqual(await ok.json(),{tasks:[]});assert.equal((await api.handle(req('/missing'))).status,404);});
test('unsupported methods report Allow',async()=>{const res=await api.handle(req('/api/tasks',{method:'DELETE'}));assert.equal(res.status,405);assert.equal(res.headers.get('allow'),'GET, POST');});
test('POST validates media, syntax and shape',async()=>{const send=(body,type='application/json')=>api.handle(req('/api/tasks',{method:'POST',body,headers:{'Content-Type':type}}));assert.equal((await send('hello','text/plain')).status,415);assert.equal((await send('{')).status,400);assert.equal((await send('null')).status,400);assert.equal((await send('{"title":" "}')).status,400);const good=await send('{"title":" Read HTTP "}');assert.equal(good.status,201);assert.deepEqual(await good.json(),{id:'demo',title:'Read HTTP'});});
