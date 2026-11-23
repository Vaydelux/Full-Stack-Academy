# Redis, Cache-Asides, BullMQ and Reliable Jobs — P5 Teaching Labs

Two dependency-free and locally executable instructor fixtures support **32 unpublished Track 16 lessons**. The examples model a cache and a queue but **do not connect to Redis or BullMQ** and must never be deployed as service implementations.

## Run

From the Full-Stack Academy repository root, on Node.js 22 or newer:

```bash
npm run test:p5-cache-jobs
npm run test:p5-redis-source
```

The first command runs **32 executable assertions** across the two labs. The second verifies that all 32 Track 16 canonical topics have source-authored MDX manuscripts that match catalog ID, title, module and unpublished state, plus **10 mutation/negative tests** for the validator. The Academy's complete runtime qualification still requires Node 24 and full product regression tests.

## Lesson lab A — Cache-aside correctness

Code: `cache.mjs`. Tests: `cache.test.mjs`.

1. Build keys from a validated server-owned tenant and resource ID. The cache must never choose a tenant or grant authorization.
2. Read from the backing store on a cache miss, then use a short explicit TTL.
3. Prevent repetitive backend loads by coalescing in-flight readers for a single process.
4. Invalidate on writes and track generations, including a delayed stale load that finishes after a write.
5. Cap in-memory entries, return defensive copies, record hit/miss/load metrics, and do not negative-cache missing records without an intentional design.

The unit tests cover TTL expiration at a clock boundary, cross-tenant cache key separation, unauthorized-looking key strings, mutable object poisoning, concurrent singleflight, stale in-flight race, writes in progress, backend failures, missing records and bounded capacity.

**Limits:** A per-process map does not provide shared Redis behavior, multi-instance locks, actual expiration/eviction algorithms, cluster consistency, memory measurement or production-grade invalidation. Validate all of those separately with a real Redis deployment.

## Lesson lab B — At-least-once work and outbox recovery

Code: `outbox.mjs`. Tests: `outbox.test.mjs`.

1. Create a synthetic event with a stable ID, tenant and minimal payload.
2. Claim a pending event with a lease, pass the event to a handler, and acknowledge successful completion.
3. Back off after failures, enforce a maximum attempt count (including expired leases), mark terminal poison events as dead, and require explicit manual redrive.
4. Demonstrate that lease expiry permits redelivery, and that an older worker must not overwrite a newer claim.
5. Run a local idempotent-effect adapter that deduplicates concurrent/repeated event IDs.

**Limits:** The simulator's Map is not a durable transactional outbox. The `InMemoryIdempotentConsumer` only deduplicates within this process. A crash after an external side effect but before a durable acknowledgment can still repeat work. A real implementation needs a database transaction, persistent unique idempotency constraints, BullMQ worker lifecycle, Redis connectivity, provider acknowledgments, retry budgets, privacy restrictions, and operational alarms.

## Student acceptance and grading

The instructor must observe both an allowed happy path and a rejected adverse path. Students should explain which source of truth is durable, what a cache can lose safely, how tenant identity is obtained, when an event may be delivered twice, why an outbox needs SQL transactions, and why the local simulator cannot certify Redis or BullMQ integration.

Recommended evidence: exact `node --version`, test command, count of executed tests and failures, the Git commit, and any real integration environment/limitations. These lessons remain `draft-unverified` and `readyToPublish: false`.

## Official documentation

- [Redis key expiration](https://redis.io/docs/latest/commands/expire/)
- [Redis SET options and atomic conditions](https://redis.io/docs/latest/commands/set/)
- [BullMQ idempotent jobs](https://docs.bullmq.io/patterns/idempotent-jobs)
- [BullMQ retries](https://docs.bullmq.io/guide/retrying-failing-jobs)
- [BullMQ production considerations](https://docs.bullmq.io/guide/going-to-production)
