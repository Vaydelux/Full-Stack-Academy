import assert from 'node:assert/strict';
import test from 'node:test';
import { transfer as solution } from '../../../drafts/nestjs/labs/application-transactions/solution.ts';
import { transfer as starter } from '../../../drafts/nestjs/labs/application-transactions/starter.ts';

// Deterministic in-memory SQL contract fake. NOT a PostgreSQL transaction test.
class WalletFake {
  constructor(wallets = { a: 5, b: 0 }, options = {}) {
    this.wallets = new Map(Object.entries(wallets));
    this.transaction = null;
    this.sql = [];
    this.options = options;
  }
  snapshot() { return Object.fromEntries(this.wallets); }
  async query(sql, params = []) {
    this.sql.push([sql, params]);
    if (sql === 'BEGIN') {
      if (this.transaction) throw Error('transaction already started');
      this.transaction = new Map(this.wallets);
      return { rowCount: null };
    }
    if (sql === 'ROLLBACK') {
      if (this.options.failRollback) throw Error('rollback disconnected');
      this.transaction = null;
      return { rowCount: null };
    }
    if (sql === 'COMMIT') {
      if (!this.transaction) throw Error('no transaction');
      this.wallets = this.transaction;
      this.transaction = null;
      return { rowCount: null };
    }
    const store = this.transaction ?? this.wallets;
    const id = params[0];
    if (sql.startsWith('UPDATE wallets SET balance=balance-1')) {
      if (!store.has(id) || (sql.includes('balance>=1') && store.get(id) < 1)) return { rowCount: 0 };
      store.set(id, store.get(id) - 1);
      return { rowCount: 1 };
    }
    if (sql.startsWith('UPDATE wallets SET balance=balance+1')) {
      if (this.options.failCredit) throw Error('simulated credit failure');
      if (!store.has(id)) return { rowCount: 0 };
      store.set(id, store.get(id) + 1);
      return { rowCount: 1 };
    }
    throw Error('unexpected SQL: ' + sql);
  }
}

test('11.03.06 instructor commits a balanced transfer', async () => {
  const db = new WalletFake();
  await solution(db, 'a', 'b');
  assert.deepEqual(db.snapshot(), { a: 4, b: 1 });
  assert.deepEqual(db.sql.map(([statement]) => statement === 'BEGIN' || statement === 'COMMIT' ? statement : 'UPDATE'),
    ['BEGIN', 'UPDATE', 'UPDATE', 'COMMIT']);
});
test('11.03.06 instructor rolls back after a failed second write', async () => {
  const db = new WalletFake({ a: 5, b: 0 }, { failCredit: true });
  await assert.rejects(solution(db, 'a', 'b'), /simulated credit failure/);
  assert.deepEqual(db.snapshot(), { a: 5, b: 0 });
  assert.equal(db.sql.at(-1)[0], 'ROLLBACK');
});
test('11.03.06 instructor rejects insufficient funds and preserves balances', async () => {
  const db = new WalletFake({ a: 0, b: 0 });
  await assert.rejects(solution(db, 'a', 'b'), /insufficient balance/);
  assert.deepEqual(db.snapshot(), { a: 0, b: 0 });
});
test('11.03.06 instructor rejects missing source or destination atomically', async () => {
  const db = new WalletFake();
  await assert.rejects(solution(db, 'missing', 'b'), /Source wallet missing/);
  await assert.rejects(solution(db, 'a', 'missing'), /Destination wallet missing/);
  assert.deepEqual(db.snapshot(), { a: 5, b: 0 });
});
test('11.03.06 instructor rejects invalid/self transfers before opening transaction', async () => {
  const db = new WalletFake();
  for (const [from, to] of [['a', 'a'], ['', 'b'], ['a', '']]) {
    await assert.rejects(solution(db, from, to), /Distinct wallet IDs/);
  }
  assert.deepEqual(db.sql, []);
});
test('11.03.06 instructor preserves both errors when rollback fails', async () => {
  const db = new WalletFake({ a: 5, b: 0 }, { failCredit: true, failRollback: true });
  await assert.rejects(solution(db, 'a', 'b'), error =>
    error instanceof AggregateError && error.errors.length === 2 &&
    /simulated credit failure/.test(error.errors[0].message) &&
    /rollback disconnected/.test(error.errors[1].message));
});
test('11.03.06 deliberately broken starter demonstrably leaves a partial debit', async () => {
  const db = new WalletFake({ a: 5, b: 0 }, { failCredit: true });
  await assert.rejects(starter(db, 'a', 'b'), /simulated credit failure/);
  assert.deepEqual(db.snapshot(), { a: 4, b: 0 }, 'Starter must reproduce a partial transfer');
  assert.deepEqual(db.sql.some(([sql]) => sql === 'BEGIN'), false);
});
