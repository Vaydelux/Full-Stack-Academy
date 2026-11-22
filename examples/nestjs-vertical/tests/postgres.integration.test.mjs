import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Client } from 'pg';

// Deliberately mandatory: absence of a live isolated PostgreSQL test environment
// must never be reported as a passing integration qualification.
test('11.03.06 committed transfer and actual PostgreSQL rollback', { timeout: 30000 }, async () => {
  if (process.env.ACADEMY_ISOLATED_PG !== 'YES' || !process.env.PG_TEST_URL) {
    throw Error('Real PostgreSQL qualification requires ACADEMY_ISOLATED_PG=YES and PG_TEST_URL for an isolated database');
  }
  const { transfer } = await import('../dist/application-transactions/solution.js');
  const client = new Client({ connectionString: process.env.PG_TEST_URL, connectionTimeoutMillis: 5000 });
  await client.connect();
  try {
    // A session-private table shadows any public wallets table; no persistent data
    // is created and the test is safe to rerun against a dedicated test database.
    await client.query("SET statement_timeout = '5000ms'");
    await client.query('CREATE TEMP TABLE wallets (id text PRIMARY KEY, balance integer NOT NULL CHECK (balance >= 0)) ON COMMIT PRESERVE ROWS');
    await client.query("INSERT INTO wallets(id,balance) VALUES ('a',5),('b',2147483647)");
    await assert.rejects(
      transfer(client, 'a', 'b'),
      /out of range|overflow/i,
      'A failed destination credit must propagate a real PostgreSQL error',
    );
    let result = await client.query('SELECT id,balance FROM wallets ORDER BY id');
    assert.deepEqual(result.rows, [
      { id: 'a', balance: 5 },
      { id: 'b', balance: 2147483647 },
    ], 'Both balances must be restored after PostgreSQL ROLLBACK');
    await client.query("UPDATE wallets SET balance=0 WHERE id='b'");
    await transfer(client, 'a', 'b');
    result = await client.query('SELECT id,balance FROM wallets ORDER BY id');
    assert.deepEqual(result.rows, [
      { id: 'a', balance: 4 },
      { id: 'b', balance: 1 },
    ], 'Both updates must commit together');

    // A zero-row UPDATE must not silently mark a transfer as successful.
    await assert.rejects(transfer(client, 'unknown', 'b'), /Source wallet missing/);
    await assert.rejects(transfer(client, 'a', 'unknown'), /Destination wallet missing/);
    await assert.rejects(transfer(client, 'a', 'a'), /Distinct wallet IDs/);
    result = await client.query('SELECT id,balance FROM wallets ORDER BY id');
    assert.deepEqual(result.rows, [
      { id: 'a', balance: 4 },
      { id: 'b', balance: 1 },
    ], 'Missing wallet and self-transfer attempts must not change balances');
    await client.query("UPDATE wallets SET balance=0 WHERE id='a'");
    await assert.rejects(transfer(client, 'a', 'b'), /insufficient balance/);
    result = await client.query('SELECT id,balance FROM wallets ORDER BY id');
    assert.deepEqual(result.rows, [
      { id: 'a', balance: 0 },
      { id: 'b', balance: 1 },
    ], 'Insufficient balance must not credit destination');
  } finally {
    await client.end();
  }
});
