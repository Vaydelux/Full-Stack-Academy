import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyRedGreen, missingTasksExport } from '../scripts/red-green.mjs';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { Test } from '@nestjs/testing';

const load = (slug, variant) => import('../dist/' + slug + '/' + variant + '.js');
const redGreen = (slug, probe, expectedFailure) => verifyRedGreen(load, slug, probe, expectedFailure);

test('11.03.01 service enforces invariants separate from request transport', async () => {
  await redGreen('service-responsibilities', async mod => {
    assert.equal(typeof mod.TasksService, 'function');
    const service = new mod.TasksService();
    assert.deepEqual(service.create('  do work  '), { title: 'do work' });
    for (const invalid of ['x', 42, null, undefined, '', [], {}, 'x'.repeat(101)]) {
      assert.throws(() => service.create(invalid), { name: 'BadRequestException' });
    }
    const controller = new mod.TasksController(service);
    assert.deepEqual(controller.create({ title: '  another task  ' }), { title: 'another task' });
    for (const invalidBody of [null, [], 42, { title: 42 }, { title: ' ' }]) {
      assert.throws(() => controller.create(invalidBody), { name: 'BadRequestException' });
    }
  });
});

test('11.03.02 repository binds untrusted input as a query parameter', async () => {
  await redGreen('repository-pattern', async ({ TaskRepository }) => {
    const calls = [];
    const repository = new TaskRepository({ query: async (...args) => { calls.push(args); return []; } });
    const payload = "x' OR 1=1 --";
    await repository.findTitle(payload);
    assert.equal(calls.length, 1);
    assert.match(calls[0][0], /\$1/);
    assert.ok(!calls[0][0].includes(payload));
    assert.deepEqual(calls[0][1], [payload]);
  });
});

test('11.03.03 DTO explicitly excludes sensitive account fields', async () => {
  await redGreen('domain-entities-dtos', async ({ accountDto }) => {
    assert.deepEqual(
      accountDto({ id: 'a1', displayName: 'Ada', passwordHash: 'secret', internalRole: 'admin' }),
      { id: 'a1', displayName: 'Ada' },
    );
  });
});

test('11.03.04 service is replaceable through the Nest DI token', async () => {
  await redGreen('dependency-inversion', async mod => {
    const { TasksService, TASK_STORE } = mod;
    assert.ok(TASK_STORE, 'A stable storage token is required');
    const container = await Test.createTestingModule({
      providers: [TasksService, { provide: TASK_STORE, useValue: { count: () => 19 } }],
    }).compile();
    try { assert.equal(container.get(TasksService).count(), 19); }
    finally { await container.close(); }
  });
});

test('11.03.05 module exports its service across the import boundary', async () => {
  await redGreen('cross-module-boundaries', async mod => {
    const container = await Test.createTestingModule({ imports: [mod.ReportsModule] }).compile();
    try { assert.equal(container.get(mod.ReportsService).count(), 1); }
    finally { await container.close(); }
  }, missingTasksExport);
});

test('11.03.06 enforces atomic transfer and rejects missing/insufficient wallets (mock contract)', async () => {
  await redGreen('application-transactions', async ({ transfer }) => {
    const successful = [];
    await transfer({ query: async (...args) => {
      successful.push(args);
      return { rowCount: 1 };
    } }, 'a', 'b');
    assert.deepEqual(successful.map(x => x[0]), [
      'BEGIN',
      'UPDATE wallets SET balance=balance-1 WHERE id=$1 AND balance>=1 RETURNING id',
      'UPDATE wallets SET balance=balance+1 WHERE id=$1 RETURNING id',
      'COMMIT',
    ]);
    assert.deepEqual(successful[1][1], ['a']);
    assert.deepEqual(successful[2][1], ['b']);

    const failed = [];
    await assert.rejects(transfer({
      query: async (...args) => {
        failed.push(args[0]);
        if (args[0].includes('balance+1')) throw Error('simulated write failure');
        return { rowCount: 1 };
      },
    }, 'a', 'b'), /simulated write failure/);
    assert.equal(failed.at(-1), 'ROLLBACK');
    assert.ok(!failed.includes('COMMIT'));

    const missingSource = [];
    await assert.rejects(transfer({
      query: async (sql) => {
        missingSource.push(sql);
        return { rowCount: sql.includes('balance-1') ? 0 : 1 };
      },
    }, 'missing', 'b'), /Source wallet missing or insufficient balance/);
    assert.equal(missingSource.at(-1), 'ROLLBACK');

    const missingDestination = [];
    await assert.rejects(transfer({
      query: async (sql) => {
        missingDestination.push(sql);
        return { rowCount: sql.includes('balance+1') ? 0 : 1 };
      },
    }, 'a', 'missing'), /Destination wallet missing/);
    assert.equal(missingDestination.at(-1), 'ROLLBACK');

    const noOp = [];
    await assert.rejects(transfer({
      query: async sql => { noOp.push(sql); return { rowCount: 1 }; },
    }, 'a', 'a'), /Distinct wallet IDs/);
    assert.deepEqual(noOp, [], 'Self-transfer must reject before starting a transaction');

    const rollbackFailed = [];
    await assert.rejects(transfer({
      query: async sql => {
        rollbackFailed.push(sql);
        if (sql === 'ROLLBACK') throw Error('rollback connection lost');
        if (sql.includes('balance+1')) throw Error('credit failed');
        return { rowCount: 1 };
      },
    }, 'a', 'b'), error => error instanceof AggregateError &&
      error.errors.length === 2 &&
      error.errors[0].message === 'credit failed' &&
      error.errors[1].message === 'rollback connection lost');
  });
});

test('11.03.07 events fire after write success and never on failed write', async () => {
  await redGreen('domain-events', async ({ TaskCommands }) => {
    const events = [];
    const emitter = { emit: (...args) => { events.push(args); } };
    const commands = new TaskCommands({ save: async () => { await nextTurn(); } }, emitter);
    await commands.create('one');
    assert.deepEqual(events, [['task.created', { title: 'one' }]]);
    const rejectedEvents = [];
    const failing = new TaskCommands(
      { save: async () => { throw Error('db down'); } },
      { emit: (...args) => { rejectedEvents.push(args); } },
    );
    await assert.rejects(failing.create('two'), /db down/);
    assert.deepEqual(rejectedEvents, []);
  });
});

test('11.03.08 project module respects provider override and routes via DI', async () => {
  await redGreen('reusable-project-module', async mod => {
    assert.ok(mod.PROJECT_STORE, 'Projects module must expose its persistence token');
    const container = await Test.createTestingModule({ imports: [mod.ProjectsModule] })
      .overrideProvider(mod.PROJECT_STORE)
      .useValue({ list: () => [{ id: 'test-project' }] })
      .compile();
    try {
      assert.deepEqual(container.get(mod.ProjectsController).list(), [{ id: 'test-project' }]);
    } finally { await container.close(); }
  });
});
