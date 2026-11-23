# P5 Track 18 — Transactional PostgreSQL Inbox Source Milestone

**2026-11-24 | Source-only, opt-in, no publication, no deployment**

## Why this milestone

The previous P5 inbox uses a local filesystem lock and an encrypted JSON snapshot. It is intentionally incapable of safe multi-host coordination. This milestone introduces a separate **PostgreSQL transaction-backed alternative** in `examples/p5-integrations/postgres-inbox`, retaining existing HTTP and local-file exercises untouched until a real server can qualify the integration.

## Implementation delivered

- PostgreSQL 17+ schema with composite `(tenant_id, provider, event_id)` identity, ciphertext/digest/AES-GCM nonce/tag columns, lease constraints, ready/expiry indexes, `FORCE ROW LEVEL SECURITY` and tenant-scoped SELECT/INSERT/UPDATE policies; DELETE is deliberately not granted by an RLS policy.
- An injected, driver-agnostic Node adapter with server-bound tenant identity and provider signing keys. HMAC v2 verifies provider/event/time/exact raw bytes before DB access; AES-256-GCM encrypts the body using tenant/provider/event as additional authenticated data. Provider secrets are never persisted in a DB row.
- Parameterized SQL transactions with `set_config('p5.tenant_id', $1, true)` on every pooled client; `INSERT ... ON CONFLICT DO NOTHING` and digest-based idempotency conflict check; `SELECT ... FOR UPDATE SKIP LOCKED` claim; database-clock lease fencing; retry/dead-letter status transitions.
- Commit and rollback uncertainty handling that discards the pooled client; do not blindly retry external effects after unclear COMMIT state.
- Opt-in PostgreSQL SQL qualifier with 16 rollback-only assertions, strict `p5_lab_inbox_*` name and loopback host, role verification and two confirmations. A separate optional live adapter qualifier requires an additional confirmation, an installed `pg` driver, and creates/drops its own temporary schema in the disposable DB.
- New release-gate script `test:p5-postgres-inbox-source` (20th mandatory P5 group), plus handoff documentation and source-aware negative tests. Existing lesson publication registries, production routes, global API, lockfiles, GitHub Actions, and Vercel Git deployment flags are unchanged.

## Executed evidence

- On local **Node.js v22.16.0**, `node --test .../postgres-inbox/*.test.mjs`: **70 passing** source/behavior/guard tests. This includes **36 adapter/fake-pool tests, 26 SQL runner/schema guards and 8 live-configuration guards**. The fake pool is not a real PostgreSQL engine, and the fake `psql` positive runner only checks CLI handling.
- JavaScript syntax checked with `node --check` on adapter, guard and live scripts.
- The actual Node 24 `npm ci` and full `verify:offline`, PostgreSQL daemon/psql SQL execution, optional `pg` live adapter/concurrency test, external provider operation, and manual/browser accessibility are **not executed** in this environment. A source-only SQL fixture is **not** real SQL proof.

## Publication truth and handoff

- **889 canonical topics**, **338 published**, **272 unpublished authored drafts**, **279 unauthored**. This module is a teaching exercise, not a new published lesson; all totals unchanged.
- Keep the Vercel Git deployment freeze in place. No production database has been accessed or mutated.
- First run `npm ci && npm run test:p5-postgres-inbox-source && npm run test:release-gate-coverage && npm run verify:offline` on a full Node24 checkout. Then run the two *explicitly confirmed* optional database commands from the lab README against a disposable PostgreSQL 17+ instance with a non-BYPASSRLS role, capture their actual evidence, fix observed failures, and only then consider publication.

## Honest architectural caveat

This is not ready to replace the local course's default gateway or a production inbox. The main application has no live database adapter wired to a tenant-authenticated server, and the adapter has no qualified migrations, KMS rotation, real provider signature adapter, monitoring, retention, throughput/load testing or hosted recovery runbook.
