import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';
import {
  tasksApi, TaskRequestError,
} from '../examples/forms-query-vertical/react-client/src/api.ts';

// Run with Node >=22 and --experimental-strip-types. This is REAL loopback
// HTTP against the exact standalone React client's dependency-free API layer.
// Unlike RHF/Query component tests, it requires no npm registry or browser.
let sequence = 0;
const nextKey = () => 'academy-test-' + String(++sequence).padStart(8, '0');
const input = (title = 'Practice valid input') => ({ title, priority: 'normal' });
const rejectsStatus = status => error => error instanceof TaskRequestError && error.status === status;

async function fixture(run, { maxItems = 100 } = {}) {
  const api = createTaskApi({ maxItems });
  const base = await api.start();
  const original = globalThis.fetch;
  globalThis.fetch = (url, options) => original(new URL(url, base), options);
  try {
    await run({ base });
  } finally {
    globalThis.fetch = original;
    await api.close();
  }
}

test('React API client returns health-checked task list over actual HTTP', async () => fixture(async () => {
  const page = await tasksApi.list('all');
  assert.deepEqual(page, { items: [], nextCursor: null });
}));

test('valid create returns a canonical task, status todo, revision 1', async () => fixture(async () => {
  const created = await tasksApi.create(input('Fresh task'), nextKey());
  assert.match(created.id, /^[0-9a-f-]{36}$/);
  assert.equal(created.title, 'Fresh task');
  assert.equal(created.status, 'todo');
  assert.equal(created.revision, 1);
  assert.equal((await tasksApi.get(created.id)).id, created.id);
}));

test('server trims accepted titles independently of RHF form', async () => fixture(async () => {
  const task = await tasksApi.create(input('  Deliberately padded  '), nextKey());
  assert.equal(task.title, 'Deliberately padded');
}));

test('server rejects invalid, whitespace-only and oversized titles', async () => fixture(async () => {
  for (const title of ['', '  ', 'ab', 'x'.repeat(101)]) {
    await assert.rejects(() => tasksApi.create(input(title), nextKey()), rejectsStatus(422));
  }
}));

test('server rejects unsupported task priority despite TS type annotation', async () => fixture(async () => {
  await assert.rejects(
    () => tasksApi.create({ title: 'Wrong priority', priority: 'urgent' }, nextKey()),
    rejectsStatus(422),
  );
}));

test('client rejects invalid idempotency key before sending bytes', async () => fixture(async () => {
  assert.throws(() => tasksApi.create(input(), 'short'), /Invalid idempotency key/);
}));

test('idempotent POST replay returns the same entity', async () => fixture(async () => {
  const key = nextKey();
  const one = await tasksApi.create(input('One request'), key);
  const replay = await tasksApi.create(input('One request'), key);
  assert.equal(one.id, replay.id);
  assert.equal((await tasksApi.list('all')).items.length, 1);
}));

test('reused idempotency key with a changed payload returns HTTP 409', async () => fixture(async () => {
  const key = nextKey();
  await tasksApi.create(input('One task'), key);
  await assert.rejects(() => tasksApi.create(input('Different task'), key), rejectsStatus(409));
}));

test('lost POST response safely recovers by retrying the identical request key', async () => fixture(async () => {
  const key = nextKey();
  const payload = input('Possible committed request');
  const originalFetch = globalThis.fetch;
  let dropNextPost = true;
  globalThis.fetch = async (url, options) => {
    const response = await originalFetch(url, options);
    if (options?.method === 'POST' && dropNextPost) {
      dropNextPost = false;
      throw new Error('Simulated response lost after server committed');
    }
    return response;
  };
  try {
    await assert.rejects(() => tasksApi.create(payload, key), /Simulated response lost/);
    const replay = await tasksApi.create(payload, key);
    assert.equal(replay.title, payload.title);
    assert.equal((await tasksApi.list('all')).items.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
}));

test('status is filtered correctly across live HTTP queries', async () => fixture(async () => {
  const todo = await tasksApi.create(input('Todo item'), nextKey());
  const doing = await tasksApi.create(input('Doing item'), nextKey());
  const done = await tasksApi.create(input('Done item'), nextKey());
  await tasksApi.updateStatus(doing.id, 'doing', 1);
  await tasksApi.updateStatus(done.id, 'done', 1);
  assert.deepEqual((await tasksApi.list('todo')).items.map(x => x.id), [todo.id]);
  assert.deepEqual((await tasksApi.list('doing')).items.map(x => x.id), [doing.id]);
  assert.deepEqual((await tasksApi.list('done')).items.map(x => x.id), [done.id]);
}));

test('client performs real multi-page cursor pagination without duplicates', async () => fixture(async () => {
  const ids = [];
  for (let i = 0; i < 14; i++) {
    ids.push((await tasksApi.create(input('Task number ' + i), nextKey())).id);
  }
  let cursor = null;
  const seen = [];
  do {
    const page = await tasksApi.list('all', cursor, undefined, 5);
    seen.push(...page.items.map(task => task.id));
    cursor = page.nextCursor;
  } while (cursor !== null);
  assert.deepEqual(seen, [...ids].reverse());
  assert.equal(new Set(seen).size, 14);
}));

test('cursor cannot be reused with a different filter', async () => fixture(async () => {
  await tasksApi.create(input('First task'), nextKey());
  await tasksApi.create(input('Second task'), nextKey());
  const first = await tasksApi.list('all', null, undefined, 1);
  assert.ok(first.nextCursor);
  await assert.rejects(() => tasksApi.list('todo', first.nextCursor), rejectsStatus(400));
}));

test('a real mutation invalidates old cursor; API maps conflict to 409', async () => fixture(async () => {
  const first = await tasksApi.create(input('First item'), nextKey());
  await tasksApi.create(input('Second item'), nextKey());
  const page = await tasksApi.list('all', null, undefined, 1);
  assert.ok(page.nextCursor);
  await tasksApi.updateStatus(first.id, 'done', 1);
  await assert.rejects(() => tasksApi.list('all', page.nextCursor), rejectsStatus(409));
  assert.equal((await tasksApi.list('all')).items.length, 2);
}));

test('invalid page limit and cursor are rejected client-side', async () => fixture(async () => {
  assert.throws(() => tasksApi.list('all', null, undefined, 0), /Invalid page size/);
  assert.throws(() => tasksApi.list('all', null, undefined, 26), /Invalid page size/);
  assert.throws(() => tasksApi.list('all', 'not a cursor'), /Invalid page cursor/);
  assert.throws(() => tasksApi.list('paused'), /Invalid task filter/);
}));

test('status transition uses If-Match, increments revision, rejects stale writes', async () => fixture(async () => {
  const task = await tasksApi.create(input('Versioned item'), nextKey());
  const doing = await tasksApi.updateStatus(task.id, 'doing', 1);
  assert.equal(doing.revision, 2);
  assert.equal(doing.status, 'doing');
  await assert.rejects(() => tasksApi.updateStatus(task.id, 'done', 1), rejectsStatus(412));
  assert.equal((await tasksApi.get(task.id)).status, 'doing');
}));

test('two concurrent status writes cannot both commit one revision', async () => fixture(async () => {
  const task = await tasksApi.create(input('Competing writes'), nextKey());
  const results = await Promise.allSettled([
    tasksApi.updateStatus(task.id, 'doing', 1),
    tasksApi.updateStatus(task.id, 'done', 1),
  ]);
  assert.equal(results.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(results.filter(x => x.status === 'rejected' && x.reason?.status === 412).length, 1);
  assert.equal((await tasksApi.get(task.id)).revision, 2);
}));

test('invalid update args are rejected before HTTP', async () => fixture(async () => {
  const badId = 'x'.repeat(36);
  assert.throws(() => tasksApi.get(badId), /Invalid task ID/);
  assert.throws(() => tasksApi.remove(badId), /Invalid task ID/);
  assert.throws(() => tasksApi.updateStatus(badId, 'done', 1), /Invalid task ID/);
  assert.throws(() => tasksApi.updateStatus('00000000-0000-0000-0000-000000000000', 'paused', 1), /Invalid task status/);
  assert.throws(() => tasksApi.updateStatus('00000000-0000-0000-0000-000000000000', 'done', 0), /Invalid task revision/);
}));

test('successful DELETE returns null and list no longer contains task', async () => fixture(async () => {
  const task = await tasksApi.create(input('To delete'), nextKey());
  assert.equal(await tasksApi.remove(task.id), null);
  assert.equal((await tasksApi.list('all')).items.length, 0);
  await assert.rejects(() => tasksApi.get(task.id), rejectsStatus(404));
}));

test('capacity limit yields terminal 409 rather than silently succeeding', async () => fixture(async () => {
  await tasksApi.create(input('First item'), nextKey());
  await assert.rejects(() => tasksApi.create(input('Over capacity'), nextKey()), rejectsStatus(409));
}, { maxItems: 1 }));

test('pre-aborted signal does not produce a misleading successful list', async () => fixture(async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => tasksApi.list('all', null, controller.signal), error => error?.name === 'AbortError');
}));
