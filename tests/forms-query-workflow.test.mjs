import test from 'node:test';
import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { createTaskClient, TaskHttpError } from '../examples/forms-query-vertical/task-client.mjs';

let nextKey = 0;
const newKey = () => 'workflow_key_' + String(++nextKey).padStart(8, '0');
async function fixture(run) {
  const api = createTaskApi();
  const base = await api.start();
  const client = createTaskClient(base);
  const raw = (path, init = {}) => fetch(new URL(path, base), { redirect: 'error', ...init });
  const make = (title = 'Practice HTTP', priority = 'normal') =>
    client.create({ title, priority }, { key: newKey() });
  try { await run({ base, client, raw, make }); }
  finally { await api.close(); }
}
async function patch(raw, id, revision, payload, extra = {}) {
  return raw('/api/tasks/' + id, { method: 'PATCH', headers: {
    'content-type': 'application/json', ...(revision === null ? {} : { 'if-match': '"' + revision + '"' }), ...extra,
  }, body: JSON.stringify(payload) });
}
async function spoofHost(base, path, host) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(new URL(path, base), { headers: { Host: host } }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end();
  });
}

test('rejects spoofed Host on API routes', async () => fixture(async ({base}) => {
  assert.equal(await spoofHost(base, '/api/health', 'evil.example:1234'), 421);
}));
test('rejects spoofed Host before serving static pages', async () => fixture(async ({base}) => {
  assert.equal(await spoofHost(base, '/', 'evil.example:1234'), 421);
}));
test('rejects wrong Origin on static pages', async () => fixture(async ({raw}) => {
  assert.equal((await raw('/', {headers:{origin:'https://evil.example'}})).status, 403);
}));
test('rejects origin-less cross-site Fetch Metadata requests', async () => fixture(async ({raw}) => {
  assert.equal((await raw('/api/tasks',{headers:{'sec-fetch-site':'cross-site'}})).status, 403);
}));
test('retains canonical same-origin access', async () => fixture(async ({raw}) => {
  assert.equal((await raw('/api/health')).status, 200);
  assert.equal((await raw('/')).status, 200);
}));
test('new task starts todo at revision one', async () => fixture(async ({make}) => {
  const task=await make();
  assert.equal(task.status, 'todo');
  assert.equal(task.revision, 1);
}));
test('GET-by-ID returns task and strong revision ETag', async () => fixture(async ({make,raw,client}) => {
  const task=await make();
  const response=await raw('/api/tasks/'+task.id);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('etag'),'"1"');
  assert.deepEqual(await response.json(),await client.get(task.id));
}));
test('unknown task is 404 with a bounded problem response', async () => fixture(async ({raw}) => {
  const r=await raw('/api/tasks/00000000-0000-0000-0000-000000000000');
  assert.equal(r.status,404);
  assert.equal((await r.json()).title,'Task not found');
}));
test('PATCH requires If-Match and returns 428 otherwise', async () => fixture(async ({make,raw}) => {
  const task=await make();
  assert.equal((await patch(raw,task.id,null,{status:'done'})).status,428);
}));
test('stale PATCH cannot change the task', async () => fixture(async ({make,raw,client}) => {
  const task=await make();
  assert.equal((await patch(raw,task.id,10,{status:'done'})).status,412);
  assert.equal((await client.get(task.id)).status,'todo');
}));
test('valid PATCH changes status and increments revision', async () => fixture(async ({make,client}) => {
  const task=await make();
  const changed=await client.setStatus(task.id,'doing',task.revision);
  assert.equal(changed.status,'doing');
  assert.equal(changed.revision,2);
  assert.equal((await client.get(task.id)).revision,2);
}));
test('same-status PATCH does not create a new revision', async () => fixture(async ({make,client}) => {
  const task=await make();
  const same=await client.setStatus(task.id,'todo',1);
  assert.equal(same.revision,1);
  const done=await client.setStatus(task.id,'done',1);
  assert.equal(done.revision,2);
}));
test('stale status cannot overwrite a newer edit', async () => fixture(async ({make,client}) => {
  const task=await make();
  await client.setStatus(task.id,'doing',1);
  await assert.rejects(()=>client.setStatus(task.id,'done',1),e=>e instanceof TaskHttpError&&e.status===412);
  assert.equal((await client.get(task.id)).status,'doing');
}));
test('PATCH rejects extra fields and bad status', async () => fixture(async ({raw,make}) => {
  const task=await make();
  for(const body of [{},[],null,{status:'paused'},{status:'done',admin:true},{status:1},{status:'doing',revision:999}]) {
    assert.equal((await patch(raw,task.id,1,body)).status,422);
  }
}));
test('PATCH rejects malformed JSON and unsupported media', async () => fixture(async ({raw,make}) => {
  const task=await make(),path='/api/tasks/'+task.id;
  assert.equal((await raw(path,{method:'PATCH',headers:{'if-match':'"1"','content-type':'application/json'},body:'{'})).status,400);
  assert.equal((await raw(path,{method:'PATCH',headers:{'if-match':'"1"','content-type':'text/plain'},body:'status=done'})).status,415);
}));
test('PATCH unknown task returns 404', async () => fixture(async ({raw}) => {
  assert.equal((await patch(raw,'00000000-0000-0000-0000-000000000000',1,{status:'done'})).status,404);
}));
test('client validates task IDs, status and revisions before fetching', async () => fixture(async ({client}) => {
  assert.throws(()=>client.setStatus('bad','done',1),/Invalid task ID/);
  assert.throws(()=>client.setStatus('00000000-0000-0000-0000-000000000000','paused',1),/Invalid task status/);
  assert.throws(()=>client.setStatus('00000000-0000-0000-0000-000000000000','todo',0),/Invalid revision/);
}));
test('status filters return only matching tasks', async () => fixture(async ({make,client}) => {
  const a=await make('First task'),b=await make('Second task'),c=await make('Third task');
  await client.setStatus(a.id,'doing',1);
  await client.setStatus(c.id,'done',1);
  assert.deepEqual((await client.list({status:'todo'})).items.map(x=>x.id),[b.id]);
  assert.deepEqual((await client.list({status:'doing'})).items.map(x=>x.id),[a.id]);
  assert.deepEqual((await client.list({status:'done'})).items.map(x=>x.id),[c.id]);
}));
test('rejects unknown status query', async () => fixture(async ({raw,client}) => {
  assert.equal((await raw('/api/tasks?status=paused')).status,400);
  assert.throws(()=>client.list({status:'paused'}),/Invalid status filter/);
}));
test('rejects repeated and unknown query parameters', async () => fixture(async ({raw}) => {
  for(const path of ['/api/tasks?limit=5&limit=10','/api/tasks?status=todo&status=done','/api/tasks?sort=title']) {
    assert.equal((await raw(path)).status,400);
  }
}));
test('cursor is bound to status filter', async () => fixture(async ({make,client}) => {
  await make('Task one'); await make('Task two');
  const page=await client.list({status:'all',limit:1});
  assert.ok(page.nextCursor);
  await assert.rejects(()=>client.list({status:'todo',limit:1,cursor:page.nextCursor}),e=>e.status===400);
}));
test('filtered pagination remains stable within one revision', async () => fixture(async ({make,client}) => {
  const ids=[];
  for(let i=0;i<4;i++){const item=await make('Task number '+i);ids.push(item.id);}
  const first=await client.list({status:'todo',limit:2});
  const second=await client.list({status:'todo',limit:2,cursor:first.nextCursor});
  assert.deepEqual([...first.items,...second.items].map(x=>x.id),ids.reverse());
  assert.equal(second.nextCursor,null);
}));
test('status change invalidates older pagination cursors', async () => fixture(async ({make,client}) => {
  const a=await make('Practice one'); await make('Practice two');
  const page=await client.list({limit:1});
  await client.setStatus(a.id,'done',1);
  await assert.rejects(()=>client.list({limit:1,cursor:page.nextCursor}),e=>e.status===409);
}));
test('no-op status write does not invalidate list cursor', async () => fixture(async ({make,client}) => {
  const a=await make('Practice one'); await make('Practice two');
  const page=await client.list({limit:1});
  await client.setStatus(a.id,'todo',1);
  assert.equal((await client.list({limit:1,cursor:page.nextCursor})).items.length,1);
}));
test('completed task can be reopened with new revision', async () => fixture(async ({make,client}) => {
  const task=await make();
  const done=await client.setStatus(task.id,'done',1);
  const reopened=await client.setStatus(task.id,'todo',done.revision);
  assert.equal(reopened.status,'todo');
  assert.equal(reopened.revision,3);
}));
test('origin failure never responds with wildcard CORS', async () => fixture(async ({raw}) => {
  const response=await raw('/api/tasks',{headers:{origin:'https://other.example'}});
  assert.equal(response.status,403);
  assert.equal(response.headers.get('access-control-allow-origin'),null);
}));

test('competing conditional writes cannot both commit the same revision', async () => fixture(async ({make,client}) => {
  const task = await make('Concurrent update');
  const outcomes = await Promise.allSettled([
    client.setStatus(task.id, 'doing', 1),
    client.setStatus(task.id, 'done', 1),
  ]);
  const accepted = outcomes.filter(outcome => outcome.status === 'fulfilled');
  const rejected = outcomes.filter(outcome => outcome.status === 'rejected');
  assert.equal(accepted.length,1);
  assert.equal(rejected.length,1);
  assert.equal(rejected[0].reason.status,412);
  const authoritative = await client.get(task.id);
  assert.equal(authoritative.revision,2);
  assert.equal(authoritative.status,accepted[0].value.status);
}));

async function rawRequestTarget(base, target) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(base, { method: 'GET', path: target }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end();
  });
}

test('rejects absolute-form request target even with a valid Host header', async () => fixture(async ({base}) => {
  assert.equal(await rawRequestTarget(base, 'http://evil.example/api/health'), 400);
}));
test('rejects network-path HTTP targets', async () => fixture(async ({base}) => {
  assert.equal(await rawRequestTarget(base, '//evil.example/api/health'), 400);
}));
