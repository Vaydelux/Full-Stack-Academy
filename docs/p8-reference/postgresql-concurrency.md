# PostgreSQL concurrency — practical reference

Companion to 12.03.01–08. Source-only reference.

| Mechanism | Use | Failure to handle |
|---|---|---|
| BEGIN / COMMIT / ROLLBACK | Atomic unit of work | Partial updates across transactions |
| READ COMMITTED | Statement-level snapshots | Read-then-write race |
| REPEATABLE READ | Stable transaction snapshot | Serialization failure |
| SERIALIZABLE | Serializable outcomes | Retry entire transaction on 40001 |
| SELECT FOR UPDATE | Lock rows before dependent changes | Deadlocks and long transactions |
| UNIQUE / ON CONFLICT | Enforce uniqueness under concurrency | Mismatched replay payload |
| UPDATE ... WHERE revision = $1 | Optimistic compare-and-set | Zero affected rows |
| EXPLAIN (ANALYZE, BUFFERS) | Observe execution and I/O | ANALYZE executes the statement |

## Decision guide

Prefer constraints for invariants that fit a row or unique key. Use atomic conditional updates for simple counters. Use transactions with consistent lock order for dependent multi-row changes. Retry deadlocks (40P01) or serialization failures (40001) only with bounded whole-transaction retries and safe external side effects. Do not retry a business conflict blindly.

## Practice

Run the companion integrity laboratory in examples/p8-backend-integrity. Compare a naive read-then-write with a conditional update. Record affected rows, transaction outcomes and invariant checks. Investigate blocking with pg_stat_activity and pg_locks. Keep transactions short and avoid network calls inside them.

Official references: https://www.postgresql.org/docs/current/transaction-iso.html and https://www.postgresql.org/docs/current/explicit-locking.html and https://www.postgresql.org/docs/current/sql-insert.html
