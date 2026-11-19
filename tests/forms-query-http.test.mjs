import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import { createTaskClient, TaskHttpError } from '../examples/forms-query-vertical/task-client.mjs';

let app, origin, client;
before(async () => { app = createTaskApi(); origin = await app.start(); client = createTaskClient(origin); });
after(async () => { await app?.close(); });
const post = (title, key, priority = 'normal') => client.create({ title, priority }, { key });
const key = n => `idempotency_${n.toString().padStart(8, '0')}`;
const raw = (path, init) => fetch(new URL(path, origin), { redirect: 'error', ...init });

test('loopback-only binding is enforced before starting', () => {
  assert.throws(() => createTaskApi({ host: '0.0.0.0' }), /Loopback/);
  assert.throws(() => createTaskApi({ maxItems: 1000 }), /limit/);
});
test('health exposes teaching-only status with no credential', async () => {
  assert.deepEqual(await client.health(), {ok:true,mode:'ephemeral-loopback'});
});
test('empty list is stable', async () => {
  assert.deepEqual(await client.list({limit:5}),{items:[],nextCursor:null});
});
test('missing and invalid content type are rejected', async () => {
  const r=await raw('/api/tasks',{method:'POST',headers:{'idempotency-key':key(1)},body:'{}'});
  assert.equal(r.status,415);
});
test('idempotency key required for create', async () => {
  const r=await raw('/api/tasks',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  assert.equal(r.status,400);
});
test('invalid task fields fail with 422', async () => {
  for(const value of [null,[],{}, {title:'x',priority:'normal'}, {title:'Hello',priority:'invalid'}, {title:'Valid',priority:'normal',admin:true}]) {
    const r=await raw('/api/tasks',{method:'POST',headers:{'idempotency-key':key(2),'content-type':'application/json'},body:JSON.stringify(value)});
    assert.equal(r.status,422);
  }
});
test('malformed JSON returns 400 with nonreflective error', async () => {
  const r=await raw('/api/tasks',{method:'POST',headers:{'idempotency-key':key(3),'content-type':'application/json'},body:'{notjson'});
  assert.equal(r.status,400);
  assert.equal((await r.json()).title,'Malformed JSON');
});
test('oversized body and declared length return 413', async () => {
  const r=await raw('/api/tasks',{method:'POST',headers:{'idempotency-key':key(4),'content-type':'application/json'},body:JSON.stringify({title:'z'.repeat(8200),priority:'normal'})});
  assert.equal(r.status,413);
});
test('POST creates normalized task with server-controlled ID and timestamp', async () => {
  const result=await post('  Learn Zod 4  ',key(5),'high');
  assert.match(result.id,/^[0-9a-f-]{36}$/);
  assert.equal(result.title,'Learn Zod 4');
  assert.equal(result.priority,'high');
  assert.ok(Date.parse(result.createdAt));
});
test('same idempotency key and normalized body replay without duplicates', async () => {
  const first=await post('Test retries',key(6));
  const replay=await post(' Test retries ',key(6));
  assert.equal(first.id,replay.id);
});
test('same idempotency key with changed payload conflicts', async () => {
  await post('Original task',key(7));
  await assert.rejects(() => post('Different task',key(7)), (e) => e instanceof TaskHttpError && e.status===409);
});
test('cross-origin mutation is refused', async () => {
  const r=await raw('/api/tasks',{method:'POST',headers:{Origin:'https://example.test','content-type':'application/json','idempotency-key':key(8)},body:JSON.stringify({title:'Origin guard',priority:'normal'})});
  assert.equal(r.status,403);
});
test('paginated results return stable opaque cursor and next page', async () => {
  const first=await client.list({limit:2});
  assert.equal(first.items.length,2);
  assert.ok(first.nextCursor);
  const second=await client.list({limit:2,cursor:first.nextCursor});
  assert.ok(second.items.length>=1);
  assert.notEqual(first.items[0].id,second.items[0].id);
});
test('invalid cursor is 400 and changed-list cursor is 409', async () => {
  await assert.rejects(()=>client.list({cursor:'not_cursor!'}), e=>e.status===400);
  const first=await client.list({limit:1});
  await post('Newly inserted',key(9));
  await assert.rejects(()=>client.list({limit:1,cursor:first.nextCursor}), e=>e.status===409);
});
test('DELETE removes one item and reports 204', async () => {
  const task=await post('Remove me',key(10));
  assert.equal(await client.remove(task.id),null);
  await assert.rejects(()=>client.remove(task.id),e=>e.status===404);
});
test('client rejects unsafe IDs and invalid list sizes before fetch', async () => {
  assert.throws(()=>client.remove('../admin'),/Invalid task ID/);
  assert.throws(()=>client.list({limit:100}),/limit/);
  assert.throws(()=>createTaskClient('file:///etc/passwd'),/Unsafe/);
});
test('aborted fetch propagates as AbortError without a client side retry', async () => {
  const signal=AbortSignal.abort();
  await assert.rejects(()=>client.list({signal}),e=>e.name==='AbortError');
});
test('capacity limit blocks additional objects without corrupting existing data', async () => {
  const small=createTaskApi({maxItems:1});
  const address=await small.start();
  const client2=createTaskClient(address);
  try{
    await client2.create({title:'First',priority:'low'},{key:key(11)});
    await assert.rejects(()=>client2.create({title:'Second',priority:'low'},{key:key(12)}),e=>e.status===409);
    assert.equal((await client2.list()).items.length,1);
  }finally{await small.close()}
});
test('local page is served with restrictive CSP and nosniff headers', async () => {
  const response=await raw('/');
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/text\/html/);
  assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
  assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.match(await response.text(),/Full-Stack Academy/);
});
test('browser modules and stylesheet are served same-origin', async () => {
  for(const [path,type] of [['/browser.mjs','text/javascript'],['/task-client.mjs','text/javascript'],['/styles.css','text/css']]){
    const r=await raw(path);
    assert.equal(r.status,200);
    assert.match(r.headers.get('content-type'),new RegExp(type));
  }
});
test('unlisted static and API paths are denied', async () => {
  for(const path of ['/secrets.txt','/api/admin','/package.json']) assert.equal((await raw(path)).status,404);
});
test('cross-origin read request does not advertise a wildcard CORS origin', async () => {
  const r=await raw('/api/tasks',{headers:{origin:'https://evil.example'}});
  assert.equal(r.status,403);
  assert.equal(r.headers.get('access-control-allow-origin'),null);
});
