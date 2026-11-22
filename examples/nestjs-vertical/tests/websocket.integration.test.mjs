import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { io } from 'socket.io-client';

// Test fixture only: this is not a production identity provider.
const tokenTenant = new Map([
  ['test-alice-secret', 'alice'],
  ['test-bob-secret', 'bob'],
]);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function connect(origin, token, tenantId) {
  const client = io(origin, {
    autoConnect: false, reconnection: false, transports: ['websocket'],
    timeout: 3500, auth: { token, tenantId },
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => fail(Error('Socket.IO connection timed out')), 4500);
    const cleanup = () => {
      clearTimeout(timer);
      client.off('connect', success);
      client.off('connect_error', fail);
    };
    const success = () => { cleanup(); resolve(client); };
    const fail = error => { cleanup(); client.disconnect(); reject(error); };
    client.on('connect', success);
    client.on('connect_error', fail);
    client.connect();
  });
}
function emitAck(client, payload) {
  return new Promise((resolve, reject) => client.timeout(3500).emit('task', payload, (error, result) =>
    error ? reject(error) : resolve(result)));
}
function nextTask(client) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { client.off('task', onTask); reject(Error('Missing expected task event')); }, 3500);
    const onTask = body => { clearTimeout(timer); client.off('task', onTask); resolve(body); };
    client.on('task', onTask);
  });
}
async function withGateway(variant, run) {
  const { TaskGateway } = await import('../dist/websocket-gateways/' + variant + '.js');
  class IsolatedModule {}
  Module({ providers: [TaskGateway] })(IsolatedModule);
  const app = await NestFactory.create(IsolatedModule, new FastifyAdapter(), { logger: false });
  const clients = [];
  try {
    await app.listen(0, '127.0.0.1');
    const server = app.get(TaskGateway).server;
    assert.ok(server, 'Socket.IO adapter must initialize an actual gateway');
    server.use((socket, next) => {
      const identity = tokenTenant.get(socket.handshake.auth?.token);
      if (!identity) return next(Error('UNAUTHORIZED'));
      // Never trust auth.tenantId: derive tenant from authenticated credentials.
      socket.data.tenantId = identity;
      next();
    });
    const address = app.getHttpServer().address();
    const origin = 'http://127.0.0.1:' + address.port;
    const register = async (token, claimedTenant) => {
      const client = await connect(origin, token, claimedTenant);
      clients.push(client);
      return client;
    };
    await run({ origin, server, register });
  } finally {
    for (const client of clients) client.disconnect();
    await app.close();
  }
}
test('11.04.03 real Socket.IO isolates both authenticated tenants and rejects unauthorized handshakes', { timeout: 20000 }, async () => {
  await withGateway('solution', async ({ origin, server, register }) => {
    const alice = await register('test-alice-secret', 'bob');
    const bob = await register('test-bob-secret', 'alice');
    const rooms = server.sockets.adapter.rooms;
    assert.ok(rooms.get('tenant:alice')?.has(alice.id), 'Alice identity must come from the server');
    assert.ok(rooms.get('tenant:bob')?.has(bob.id), 'Bob identity must come from the server');

    const aliceMessages = [];
    const bobMessages = [];
    alice.on('task', payload => aliceMessages.push(payload));
    bob.on('task', payload => bobMessages.push(payload));

    assert.deepEqual(await emitAck(alice, { title: '  alpha  ', tenantId: 'bob' }), { accepted: true });
    assert.deepEqual(await nextExpected(aliceMessages, 1), [{ title: 'alpha' }]);
    await sleep(200);
    assert.deepEqual(bobMessages, [], 'Alice may not send into Bob tenant via forged message body');

    assert.deepEqual(await emitAck(bob, { title: '  beta  ', tenantId: 'alice' }), { accepted: true });
    assert.deepEqual(await nextExpected(bobMessages, 1), [{ title: 'beta' }]);
    await sleep(200);
    assert.deepEqual(aliceMessages, [{ title: 'alpha' }], 'Bob may not broadcast into Alice tenant');

    for (const invalid of [null, {}, [], { title: 42 }, { title: [] }, { title: '' }, { title: 'x'.repeat(101) }]) {
      assert.deepEqual(await emitAck(alice, invalid), { error: 'INVALID_TASK' });
    }
    assert.deepEqual(await emitAck(bob, { title: 'x'.repeat(101) }), { error: 'INVALID_TASK' });
    await sleep(150);
    assert.deepEqual(aliceMessages, [{ title: 'alpha' }], 'Malformed payloads must never broadcast');
    assert.deepEqual(bobMessages, [{ title: 'beta' }], 'Malformed payloads must never leak');
    await assert.rejects(connect(origin, 'incorrect', 'alice'), /UNAUTHORIZED/);
  });
});
async function nextExpected(messages, count) {
  for (let attempt = 0; attempt < 35 && messages.length < count; attempt++) await sleep(20);
  assert.equal(messages.length, count, 'Expected a same-tenant broadcast');
  return messages;
}

test('11.04.03 intentionally broken student gateway exposes cross-tenant broadcast in real Socket.IO', { timeout: 15000 }, async () => {
  await withGateway('starter', async ({ register }) => {
    const alice = await register('test-alice-secret', 'alice');
    const bob = await register('test-bob-secret', 'bob');
    const leaked = nextTask(bob);
    // The deliberately broken starter calls server.emit(), broadcasting across rooms.
    alice.emit('task', { title: 'private', tenantId: 'alice' });
    assert.deepEqual(await leaked, { title: 'private', tenantId: 'alice' },
      'Negative starter must reproduce a concrete cross-tenant exposure');
  });
});
