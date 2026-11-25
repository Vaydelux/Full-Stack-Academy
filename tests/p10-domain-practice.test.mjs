import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { TaskRepository as SafeRepo } from '../drafts/nestjs/labs/repository-pattern/solution.ts';
import { TaskRepository as UnsafeRepo } from '../drafts/nestjs/labs/repository-pattern/starter.ts';
import { accountDto as safeDto } from '../drafts/nestjs/labs/domain-entities-dtos/solution.ts';
import { accountDto as unsafeDto } from '../drafts/nestjs/labs/domain-entities-dtos/starter.ts';
import { TaskCommands as SafeCommands } from '../drafts/nestjs/labs/domain-events/solution.ts';
import { TaskCommands as UnsafeCommands } from '../drafts/nestjs/labs/domain-events/starter.ts';
import { transfer as safeTransfer } from '../drafts/nestjs/labs/application-transactions/solution.ts';
import { transfer as unsafeTransfer } from '../drafts/nestjs/labs/application-transactions/starter.ts';

async function verifyBinding(Repo) {
  const calls = [];
  const repo = new Repo({ query: async (...args) => { calls.push(args); } });
  for (const title of ['Ordinary task', "O'Brien", '日本語']) await repo.findTitle(title);
  assert.deepEqual(calls, ['Ordinary task', "O'Brien", '日本語'].map(title => ['SELECT * FROM tasks WHERE title = $1', [title]]));
}
test('repository SQL text stays constant for distinct title values', async () => {
  await verifyBinding(SafeRepo);
  await assert.rejects(verifyBinding(UnsafeRepo), { code: 'ERR_ASSERTION' });
});
function verifyDto(project) {
  const entity = Object.freeze({ id: 'u1', displayName: 'Student', passwordHash: 'fake', internalRole: 'owner', futurePrivate: 'hidden' });
  const dto = project(entity);
  assert.deepEqual(JSON.parse(JSON.stringify(dto)), { id: 'u1', displayName: 'Student' });
  assert.notEqual(dto, entity);
  assert.equal(entity.futurePrivate, 'hidden');
}
test('public DTO excludes future private fields without modifying entity', () => {
  verifyDto(safeDto);
  assert.throws(() => verifyDto(unsafeDto), { code: 'ERR_ASSERTION' });
});
async function verifyPendingWrite(Commands) {
  const events = new EventEmitter();
  const delivered = [];
  events.on('task.created', payload => delivered.push(payload));
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const pending = new Commands({ save: () => gate }, events).create('Task');
  const premature = delivered.slice();
  release();
  await pending;
  assert.deepEqual(premature, []);
  assert.deepEqual(delivered, [{ title: 'Task' }]);
}
test('event is not emitted while persistence is pending', async () => {
  await verifyPendingWrite(SafeCommands);
  await assert.rejects(verifyPendingWrite(UnsafeCommands), { code: 'ERR_ASSERTION' });
});
test('listener error after successful write illustrates ambiguous acknowledgement', async () => {
  let stored = false;
  const events = new EventEmitter();
  events.on('task.created', () => { throw Error('listener failed'); });
  const command = new SafeCommands({ save: async () => { stored = true; } }, events);
  await assert.rejects(command.create('Task'), /listener failed/);
  assert.equal(stored, true);
});
async function verifyInvalidWallets(transfer) {
  const calls = [];
  const db = { query: async (...args) => { calls.push(args); return { rowCount: 1 }; } };
  let failure;
  try { await transfer(db, 'same', 'same'); } catch (error) { failure = error; }
  assert.match(failure?.message ?? '', /Distinct wallet IDs/);
  assert.deepEqual(calls, []);
}
test('self-transfer fails before any database call', async () => {
  await verifyInvalidWallets(safeTransfer);
  await assert.rejects(verifyInvalidWallets(unsafeTransfer), { code: 'ERR_ASSERTION' });
});
async function verifyMissingDestination(transfer) {
  const calls = [];
  const db = { query: async (sql, params) => {
    calls.push([sql, params]);
    return { rowCount: sql.includes('balance+1') ? 0 : 1 };
  } };
  let failure;
  try { await transfer(db, 'a', 'b'); } catch (error) { failure = error; }
  assert.match(failure?.message ?? '', /Destination wallet missing/);
  assert.deepEqual(calls.map(([sql]) => sql.split(' ')[0]), ['BEGIN', 'UPDATE', 'UPDATE', 'ROLLBACK']);
  assert.deepEqual(calls[1][1], ['a']);
  assert.deepEqual(calls[2][1], ['b']);
}
test('missing destination triggers rollback instead of commit', async () => {
  await verifyMissingDestination(safeTransfer);
  await assert.rejects(verifyMissingDestination(unsafeTransfer), { code: 'ERR_ASSERTION' });
});
test('rollback failure preserves the original database error', async () => {
  const writeError = Error('credit failed');
  const rollbackError = Error('rollback failed');
  const db = { query: async sql => {
    if (sql.includes('balance+1')) throw writeError;
    if (sql === 'ROLLBACK') throw rollbackError;
    return { rowCount: 1 };
  } };
  await assert.rejects(safeTransfer(db, 'a', 'b'), error => error instanceof AggregateError && error.errors[0] === writeError && error.errors[1] === rollbackError);
});
