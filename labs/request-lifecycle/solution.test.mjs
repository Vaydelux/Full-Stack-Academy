import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
const target = process.env.ACADEMY_LAB_TARGET === 'starter' ? 'starter' : 'solution';
const { createApp } = await import(`./${target}/server.mjs`);
async function withApp(run) {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
test('GET returns a JSON project response',()=>withApp(async base=>{
  const res=await fetch(base+'/api/projects');
  assert.equal(res.status,200);
  assert.equal(res.ok,true);
  assert.match(res.headers.get('content-type'),/application\/json/);
  assert.deepEqual(await res.json(),{projects:[{id:'p1',name:'Platform'}]});
}));
test('an unknown path returns a 404 response',()=>withApp(async base=>{
  const res=await fetch(base+'/api/missing');
  assert.equal(res.status,404);
  assert.equal(res.ok,false);
  assert.deepEqual(await res.json(),{error:'Not found'});
}));
test('POST returns 405 and an Allow header',()=>withApp(async base=>{
  const res=await fetch(base+'/api/projects',{method:'POST'});
  assert.equal(res.status,405);
  assert.equal(res.headers.get('allow'),'GET');
  assert.deepEqual(await res.json(),{error:'Method not allowed'});
}));
