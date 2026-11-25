import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyRedGreen } from '../scripts/red-green.mjs';
import { firstValueFrom, of, throwError } from 'rxjs';
import { Test } from '@nestjs/testing';

const load = (slug, variant) => import('../dist/' + slug + '/' + variant + '.js');
const redGreen = (slug, probe, expectedFailure) => verifyRedGreen(load, slug, probe, expectedFailure);
const httpContext = req => ({ switchToHttp: () => ({ getRequest: () => req }) });

test('11.04.01 custom provider resolves an overridden storage port', async () => {
  await redGreen('custom-provider-tokens', async mod => {
    assert.ok(mod.STORAGE);
    const container = await Test.createTestingModule({
      providers: [mod.Reader, { provide: mod.STORAGE, useValue: { read: () => 'test-data' } }],
    }).compile();
    try { assert.equal(container.get(mod.Reader).read(), 'test-data'); }
    finally { await container.close(); }
  });
});

test('11.04.02 async dynamic configuration rejects plaintext HTTP and exports HTTPS URL', async () => {
  await redGreen('async-module-configuration', async mod => {
    assert.ok(mod.API_URL);
    const original = process.env.API_URL;
    try {
      process.env.API_URL = 'http://example.org';
      await assert.rejects(
        Test.createTestingModule({ imports: [mod.ApiModule.forRootAsync()] }).compile(),
        /HTTPS API URL required/,
      );
      process.env.API_URL = 'https://example.org/api';
      const container = await Test.createTestingModule({ imports: [mod.ApiModule.forRootAsync()] }).compile();
      try { assert.equal(container.get(mod.API_URL), 'https://example.org/api'); }
      finally { await container.close(); }
    } finally {
      if (original === undefined) delete process.env.API_URL;
      else process.env.API_URL = original;
    }
  });
});

test('11.04.03 gateway validates unknown payloads and strictly isolates rooms', async () => {
  await redGreen('websocket-gateways', async ({ TaskGateway }) => {
    const emitted = [];
    const gateway = new TaskGateway();
    gateway.server = {
      to(room) { return { emit: (event, body) => emitted.push({ room, event, body }) }; },
      emit() { throw Error('global broadcast is forbidden'); },
    };
    const disconnected = [];
    const anonymous = { data: {}, disconnect: () => disconnected.push(true), join: () => { throw Error('anonymous joined'); } };
    assert.equal(typeof gateway.handleConnection, 'function', 'Gateway must expose its connection guard');
    gateway.handleConnection(anonymous);
    assert.deepEqual(disconnected, [true]);
    const joined = [];
    const alice = { data: { tenantId: 'alice' }, join: room => joined.push(room) };
    gateway.handleConnection(alice);
    assert.deepEqual(joined, ['tenant:alice']);
    assert.deepEqual(gateway.publish(alice, { title: '  example  ' }), { accepted: true });
    assert.deepEqual(emitted, [{ room: 'tenant:alice', event: 'task', body: { title: 'example' } }]);
    assert.deepEqual(gateway.publish(anonymous, { title: 'x' }), { error: 'UNAUTHORIZED' });
    for (const invalid of [null, undefined, [], {}, { title: 42 }, { title: [] }, { title: ' ' }, { title: 'x'.repeat(101) }]) {
      assert.deepEqual(gateway.publish(alice, invalid), { error: 'INVALID_TASK' }, 'Unexpected acceptance of invalid payload');
    }
    assert.equal(emitted.length, 1, 'Rejected messages cannot broadcast to a tenant');
  });
});

test('11.04.04 shutdown closes dependency exactly once', async () => {
  await redGreen('graceful-shutdown', async ({ Worker }) => {
    let calls = 0;
    const worker = new Worker({ close: () => { calls += 1; } });
    assert.equal(typeof worker.onApplicationShutdown, 'function');
    worker.onApplicationShutdown();
    worker.onApplicationShutdown();
    assert.equal(calls, 1);
  });
});

test('11.04.05 testing fixture injects a fake mailer, not live adapter', async () => {
  await redGreen('testing-module-overrides', async ({ Mailer, Notifications, buildTestModule }) => {
    const sent = [];
    const container = await buildTestModule({ send: async address => { sent.push(address); } });
    try {
      assert.ok(container.get(Mailer));
      const notifications = container.get(Notifications);
      assert.equal(typeof notifications.notify, 'function', 'Notification service must expose the tested behavior');
      await notifications.notify('student@example.org');
      assert.deepEqual(sent, ['student@example.org']);
    } finally { await container.close(); }
  });
});

test('11.04.06 cache isolates users inside tenants, bounds storage and invalidates on writes', async () => {
  await redGreen('caching-interceptors', async ({ TasksCacheInterceptor }) => {
    const interceptor = new TasksCacheInterceptor();
    let calls = 0;
    const handler = { handle: () => of({ counter: ++calls }) };
    const request = (tenantId, userId, method = 'GET', url = '/tasks', next = handler) =>
      firstValueFrom(interceptor.intercept(
        httpContext({ method, url, user: tenantId ? { tenantId, userId } : undefined }),
        next,
      ));
    assert.deepEqual(await request('a', 'alice'), { counter: 1 });
    assert.deepEqual(await request('a', 'alice'), { counter: 1 }, 'Second GET should use the cache');
    assert.deepEqual(await request('a', 'bob'), { counter: 2 }, 'Users in the same tenant may have different permissions');
    assert.deepEqual(await request('b', 'alice'), { counter: 3 });
    assert.deepEqual(await request(undefined, undefined), { counter: 4 }, 'Anonymous requests must bypass cache');
    assert.deepEqual(await request('a', undefined), { counter: 5 }, 'Missing user identity must bypass cache');
    assert.deepEqual(await request('a', 'alice', 'POST'), { counter: 6 }, 'Mutations are never cached');
    assert.deepEqual(await request('a', 'alice'), { counter: 7 }, 'POST must invalidate tenant cache');
    assert.deepEqual(await request('a', 'bob'), { counter: 8 }, 'All users in a mutated tenant must be invalidated');
    assert.deepEqual(await request('b', 'alice'), { counter: 3 }, 'Another tenant remains cached');
    await assert.rejects(request('a', 'alice', 'POST', '/tasks', {
      handle: () => throwError(() => Error('failed mutation')),
    }), /failed mutation/);
    assert.deepEqual(await request('a', 'alice'), { counter: 7 }, 'Failed mutations must not invalidate cached reads');

    for (let i = 0; i < 105; i++) await request('bounded', 'user-' + i);
    assert.ok(interceptor.cache.size <= 100, 'Bounded retention must not exceed 100 entries');
    const key = JSON.stringify(['a', 'alice', '/tasks']);
    // The bounded cycle may evict the entry; explicitly repopulate before expiry testing.
    await request('a', 'alice');
    interceptor.cache.get(key).until = Date.now() - 1;
    const beforeExpiryFetch = calls;
    assert.deepEqual(await request('a', 'alice'), { counter: beforeExpiryFetch + 1 }, 'Expired data must be refetched');
  });
});

test('11.04.07 liveness distinct from dependency readiness (Nest controller)', async () => {
  await redGreen('health-endpoints', async mod => {
    assert.ok(mod.Dependencies);
    const deps = new mod.Dependencies();
    const controller = new mod.HealthController(deps);
    assert.deepEqual(controller.live(), { status: 'alive' });
    assert.throws(() => controller.ready());
    deps.ready = true;
    assert.deepEqual(controller.ready(), { status: 'ready' });
  });
});


test('11.04.08 production-style skeleton binds loopback on an ephemeral test port', async () => {
  const { bootstrap } = await load('production-service-skeleton', 'solution');
  const app = await bootstrap(0);
  try {
    assert.equal(app.getHttpAdapter().getType(), 'fastify');
    const address = app.getHttpServer().address();
    assert.equal(address.address, '127.0.0.1');
    assert.ok(address.port > 0);
    const response = await fetch('http://127.0.0.1:' + address.port + '/missing');
    assert.equal(response.status, 404);
  } finally { await app.close(); }

  // Do not execute the intentionally unsafe starter: it binds a public interface.
  // Verify its broken fixture still demonstrates the exact exposure learners must fix.
  const { readFile } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const starterPath = fileURLToPath(new URL('../../../drafts/nestjs/labs/production-service-skeleton/starter.ts', import.meta.url));
  const starter = await readFile(starterPath, 'utf8');
  assert.match(starter, /0\.0\.0\.0/);
  assert.doesNotMatch(starter, /enableShutdownHooks\s*\(/);
});
