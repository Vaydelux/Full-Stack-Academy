import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { io } from 'socket.io-client';

const allowedTokens = new Map([
  ['test-alice-secret', 'alice'],
  ['test-bob-secret', 'bob'],
]);

async function connect(origin, token, tenantId) {
  const client = io(origin, {
    autoConnect: false,
    transports: ['websocket'],
    reconnection: false,
    timeout: 3500,
    auth: { token, tenantId }, // spoofable tenantId must be ignored on server
  });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => fail(Error('Socket connect timed out')), 4000);
      const cleanup = () => {
        clearTimeout(timer);
        client.off('connect', succeed);
        client.off('connect_error', fail);
      };
      const succeed = () => { cleanup(); resolve(); };
      const fail = error => { cleanup(); reject(error); };
      client.on('connect', succeed);
      client.on('connect_error', fail);
      client.connect();
    });
    return client;
  } catch (error) {
    client.disconnect();
    throw error;
  }
}
function emitAck(client, event, payload) {
  return new Promise((resolve, reject) => {
    client.timeout(3000).emit(event, payload, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}
test('11.04.03 two authenticated clients cannot receive another tenant broadcast', { timeout: 20000 }, async () => {
  const { TaskGateway } = await import('../dist/websocket-gateways/solution.js');
  class TestModule {}
  Module({ providers: [TaskGateway] })(TestModule);
  const app = await NestFactory.create(TestModule, new FastifyAdapter(), { logger: false });
  const clients = [];
  try {
    await app.listen(0, '127.0.0.1');
    const server = app.get(TaskGateway).server;
    assert.ok(server, 'Real Socket.IO gateway must be connected to Nest');

    // Server assigns identity from the test token, NEVER from a client-supplied tenant.
    // This is a test-only handshake and not production authentication.
    server.use((socket, next) => {
      const assigned = allowedTokens.get(socket.handshake.auth?.token);
      if (!assigned) return next(Error('UNAUTHORIZED'));
      socket.data.tenantId = assigned;
      next();
    });
    const address = app.getHttpServer().address();
    const origin = 'http://127.0.0.1:' + address.port;
    const alice = await connect(origin, 'test-alice-secret', 'bob');
    clients.push(alice);
    const bob = await connect(origin, 'test-bob-secret', 'alice');
    clients.push(bob);

    // Let gateway.handleConnection join both authenticated socket rooms.
    const rooms = server.sockets.adapter.rooms;
    assert.ok(rooms.get('tenant:alice')?.has(alice.id));
    assert.ok(rooms.get('tenant:bob')?.has(bob.id));

    const aliceMessages = [];
    const bobMessages = [];
    alice.on('task', data => aliceMessages.push(data));
    bob.on('task', data => bobMessages.push(data));
    const ack = await emitAck(alice, 'task', { title: '  isolated  ', tenantId: 'bob' });
    assert.deepEqual(ack, { accepted: true });
    await new Promise(resolve => setTimeout(resolve, 150));
    assert.deepEqual(aliceMessages, [{ title: 'isolated' }]);
    assert.deepEqual(bobMessages, [], 'Bob must not receive Alice tenant broadcasts');

    await assert.rejects(
      connect(origin, 'incorrect', 'alice'),
      /UNAUTHORIZED/,
      'Invalid credentials must not result in a connected tenant socket',
    );
  } finally {
    for (const client of clients) client.disconnect();
    await app.close();
  }
});
