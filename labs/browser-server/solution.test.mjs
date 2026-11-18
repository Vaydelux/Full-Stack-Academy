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
test('HTML and script use the correct response types', () => withApp(async base => {
  const html = await fetch(base);
  assert.equal(html.status,200);
  assert.match(html.headers.get('content-type'), /text\/html/);
  assert.match(await html.text(), /<script src="\/app.js"/);
  const js = await fetch(base+'/app.js');
  assert.equal(js.status,200);
  assert.match(js.headers.get('content-type'), /javascript/);
  assert.match(await js.text(), /Browser code ran/);
}));
test('public routes never expose the private sentinel', () => withApp(async base => {
  for (const route of ['/','/app.js','/api/status','/private']) {
    const res=await fetch(base+route);
    const text=await res.text();
    assert.doesNotMatch(text,/server-only-demo-value/);
    if (route==='/api/status') assert.deepEqual(JSON.parse(text),{ready:true});
    if (route==='/private') assert.equal(res.status,404);
  }
}));
