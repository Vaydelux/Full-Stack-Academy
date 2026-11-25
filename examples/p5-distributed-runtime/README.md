# F8.3 — distributed runtime vertical

Source implementation only, not a service qualification or a publication approval. The original in-memory exercises remain available. New optional workspace is independent of frontend dependencies.

## Install

Use Node 24.11.1+ within 24.x. From this directory run npm install --package-lock-only --ignore-scripts, inspect and commit the genuine lockfile, then npm ci. The lockfile does not exist yet; no fabricated transitive dependencies. Run npm audit and inspect the dependency resolution before executing. The versions in package.json are pinned; compatibility and security of the resolved dependency tree remain to be tested.

## PostgreSQL
Use a fresh PostgreSQL 17+ database named academy_test_distributed with a dedicated, non-superuser owner role without elevated privileges or privileged memberships. Numeric loopback only, never a tunnel to live infrastructure. Set ACADEMY_DISTRIBUTED_PG_ISOLATED=YES and ACADEMY_DISTRIBUTED_PG_URL to the disposable local database URL, including explicit port. Run from the repo root: npm run qualify:postgresql:concurrency. The runner creates and drops only its own UUID-named schema. It verifies separate backend PIDs, repeatable-read visibility, SKIP LOCKED, deadlock SQLSTATE 40P01, an intentionally lost update and version-guarded correction, atomic transfer/rollback and a concurrent unique receipt/effect race. Test source covers the 12.03 concepts; not all lesson-specific contracts or manual reviews are qualified.

## Redis and BullMQ
Use an independent standalone Redis 7.0.8+ instance configured with noeviction and no unrelated keys. Set ACADEMY_REDIS_ISOLATED=YES and ACADEMY_REDIS_URL (numeric loopback, explicit port and /0). Do not point at shared Redis, even via a tunnel. Run npm run qualify:p5:redis, then with both PostgreSQL and Redis configured run npm run qualify:p5:queue. The cache uses atomic Lua generation snapshots, conditional fills and invalidation, bounded TTL/payloads, and tenant/run key names. It never grants authorization. It does not guarantee linearizability across a database commit and subsequent invalidation, solve cache stampedes across processes or guarantee safe negative caching. Redis errors fail the exercise rather than silently ignoring a correctness boundary. Only exact namespace keys are removed; TTL handles residual keys if a test fails.

The queue uses a random test queue, committed SQL intent, stable job ID, retained completed/failed jobs, bounded attempts and a consumer transaction with a unique receipt and database effect. Test source demonstrates enqueue-before-dispatch-mark replay, forced transaction rollback, retry, terminal failure and replay with a new transport ID. It does not provide exactly-once external side effects, multi-process crash/Redis-loss recovery, permanent production outbox reconciliation or an operational DLQ redrive service. Discard the independent services after testing; no FLUSHDB or global cleanup commands.

## Supabase SDK acceptance
Use the independent disposable local stack and two confirmed example.test identities specified in examples/p4-runtime/README.md. Apply that workspace's fixture.sql, then review and apply realtime-fixture.sql manually in the disposable local database. This is a test fixture, not a hosted migration. Ensure no permissive overlapping Realtime policies; use the installed CLI help, and configure the disposable stack for private-only Realtime channels. Use the same ACADEMY_SUPABASE_* environment variables, with publishable or legacy anon key only. Run npm run qualify:p4:supabase-extended. The test checks actual signed upload authorization and wrong-path rejection, signed download redemption/expiry, positive and negative storage reads, owner-private Broadcast delivery and explicit authorization denial on a second user's foreign-topic subscription. Network failure/timeouts are not counted as authorization rejection. Signed URLs are bearer capabilities until expiry; do not log tokens. No live connected Supabase project was changed. Session refresh/revocation, signed upload expiry (long provider TTL), public-channel configuration verification, replay/reconnect and actual browser clients remain separate evidence.

## Offline checks
npm run test:p5-distributed-source uses injected Redis/PostgreSQL responses for 8 source tests. No Redis, PostgreSQL, BullMQ or Supabase runtime is contacted. This source test group is required by test:p5-bundle and verify:offline. Live runners deliberately require installed pinned packages and real disposable services and must not silently skip.

## References
- https://docs.bullmq.io/guide/connections
- https://docs.bullmq.io/guide/retrying-failing-jobs
- https://redis.io/docs/latest/commands/eval/
- https://www.postgresql.org/docs/current/transaction-iso.html
- https://supabase.com/docs/reference/javascript/file-buckets-uploadtosignedurl
- https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl
- https://supabase.com/docs/guides/realtime/authorization

Actual live execution, lockfile creation, full repository build and release qualification remain blocked in the current local environment. Do not mark any lesson complete from this source or its synthetic tests.
