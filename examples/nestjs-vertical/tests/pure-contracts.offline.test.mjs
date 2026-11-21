import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskRepository as SafeRepo } from '../../../drafts/nestjs/labs/repository-pattern/solution.ts';
import { TaskRepository as UnsafeRepo } from '../../../drafts/nestjs/labs/repository-pattern/starter.ts';
import { accountDto as safeDto } from '../../../drafts/nestjs/labs/domain-entities-dtos/solution.ts';
import { accountDto as unsafeDto } from '../../../drafts/nestjs/labs/domain-entities-dtos/starter.ts';
import { accountResponse as safeResponse } from '../../../drafts/nestjs/labs/structured-responses/solution.ts';
import { accountResponse as unsafeResponse } from '../../../drafts/nestjs/labs/structured-responses/starter.ts';
import { withRequest as safeContext, requestId as safeId } from '../../../drafts/nestjs/labs/request-context/solution.ts';
import { withRequest as unsafeContext, requestId as unsafeId } from '../../../drafts/nestjs/labs/request-context/starter.ts';
import { TaskCommands as SafeCommands } from '../../../drafts/nestjs/labs/domain-events/solution.ts';
import { TaskCommands as UnsafeCommands } from '../../../drafts/nestjs/labs/domain-events/starter.ts';

const account = { id: 'a', displayName: 'Ada', passwordHash: 'private-secret', internalRole: 'owner' };

test('11.03.02 SQL repository binds adversarial input without interpolation', async () => {
  const calls = [];
  const repo = new SafeRepo({ query: async (...args) => calls.push(args) });
  const attack = "x' OR 1=1 --";
  await repo.findTitle(attack);
  assert.deepEqual(calls, [['SELECT * FROM tasks WHERE title = $1', [attack]]]);
});
test('11.03.02 intentionally vulnerable repository interpolates user data', async () => {
  const calls = [];
  await new UnsafeRepo({ query: async (...args) => calls.push(args) }).findTitle("x' OR 1=1 --");
  assert.match(calls[0][0], /OR 1=1/);
  assert.equal(calls[0].length, 1, 'unsafe starter has no bound parameter array');
});
test('11.03.03 DTO returns exact public fields', () => {
  assert.deepEqual(safeDto(account), { id: 'a', displayName: 'Ada' });
});
test('11.03.03 intentionally broken DTO leaks hidden fields', () => {
  assert.equal(unsafeDto(account).passwordHash, 'private-secret');
  assert.equal(unsafeDto(account).internalRole, 'owner');
});
test('11.02.06 structured response excludes password hash', () => {
  assert.deepEqual(safeResponse(account), { id: 'a', displayName: 'Ada' });
});
test('11.02.06 intentionally broken response leaks password hash', () => {
  assert.equal(unsafeResponse(account).passwordHash, 'private-secret');
});
async function overlap(withRequest, requestId) {
  let release, started;
  const gate = new Promise(resolve => { release = resolve; });
  const began = new Promise(resolve => { started = resolve; });
  const first = withRequest('request-a', async () => {
    started();
    await gate;
    return requestId();
  });
  await began;
  const second = await withRequest('request-b', async () => requestId());
  release();
  return [await first, second];
}
test('11.02.07 AsyncLocalStorage preserves concurrent request isolation', async () => {
  assert.deepEqual(await overlap(safeContext, safeId), ['request-a', 'request-b']);
  assert.equal(safeId(), undefined);
});
test('11.02.07 intentionally broken global request ID leaks across concurrent calls', async () => {
  assert.deepEqual(await overlap(unsafeContext, unsafeId), ['request-b', 'request-b']);
});
test('11.03.07 event must follow an actual successful write', async () => {
  let stored = false;
  const order = [];
  const cmd = new SafeCommands({ save: async () => { stored = true; order.push('write'); } },
    { emit: () => { assert.equal(stored, true); order.push('event'); } });
  await cmd.create('task');
  assert.deepEqual(order, ['write', 'event']);
});
test('11.03.07 failed writes must not emit success events', async () => {
  const events = [];
  const fail = { save: async () => { throw Error('storage failed'); } };
  const publisher = { emit: name => events.push(name) };
  await assert.rejects(new SafeCommands(fail, publisher).create('task'), /storage failed/);
  assert.deepEqual(events, []);
});
test('11.03.07 intentionally broken starter emits before failed write', async () => {
  const events = [];
  const fail = { save: async () => { throw Error('storage failed'); } };
  await assert.rejects(new UnsafeCommands(fail, { emit: name => events.push(name) }).create('task'), /storage failed/);
  assert.deepEqual(events, ['task.created']);
});
