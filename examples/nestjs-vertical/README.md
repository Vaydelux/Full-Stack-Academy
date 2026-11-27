# NestJS 12 curriculum laboratory — source candidate

This is a **non-production** laboratory for the 32 canonical topics `11.01.01–11.04.08`, authored November 20, 2026. The exercises are in `drafts/nestjs/labs/` so they cannot accidentally appear as published academy labs. Lessons are MDX drafts under `drafts/nestjs/lessons/`.

Target runtime: Node.js 24.9+; NestJS 12; TypeScript 6; Fastify adapter where HTTP integration is needed. The Jest-free Node test runner compiles the real framework-decorated source and asserts both instructor passes and intentionally broken learner starters fail for expected semantic reasons.

## Release prerequisite

**There is intentionally no npm package-lock here yet.** The current authoring environment cannot reach the package registry. Never invent package integrity hashes or claim this project passed its runtime gate.

On a trusted development machine with npm registry access, run:

```bash
cd examples/nestjs-vertical
npm install --package-lock-only
npm run qualify
```

Then run repository-level source checks and commit the genuine lockfile plus any corrections. As written, the eight architecture tests are **authored but unexecuted**. Other 24 lesson packs include versioned instructor and starter sources and acceptance contracts, but need corresponding concrete real Nest HTTP/service tests before their modules can publish. Real PostgreSQL transaction examples in 11.03 require isolated Postgres for qualification; a mock is not proof of a DB transaction.

**Security note:** Toy bearer strings, request headers, in-memory stores and localhost endpoints are educational. They do not implement production authentication, tenant permissions, durable operations or payment-grade idempotency. Never expose the examples on a public interface.

## Expanded test inventory — November 21

The isolated harness now includes four Node test files with **32 authored topic tests**, matching all 32 planned NestJS draft lessons. `npm run test:runtime` invokes all suites after TypeScript compilation. `npm run qualify` first checks lock completeness and registry integrity fields, installs with `npm ci`, runs typecheck and build, then runs all runtime tests.

The `11.03.06` transaction behavior test uses a mock client to verify BEGIN/COMMIT/ROLLBACK call sequencing; **it is not real database transaction evidence**. A separate isolated PostgreSQL test must demonstrate rollback with a real acquired connection and no partial updates.

The `11.04.03` gateway test verifies tenant-room targeting through a mocked transport; **it is not two authenticated Socket.IO client isolation evidence**. A real handshake middleware and two independent authenticated clients are required before promotion. The `11.04.08` instructor runs only on loopback using port 0 during tests; the unsafe publicly bound starter is inspected without execution.

No full qualification was run in the authoring environment. Do not mark 32/32 green until real runtime evidence is collected.

## Real integration release gates — November 21, 2026

Two additional **authored, unexecuted** integration tests are now required before declaring P2 verified:

- `npm run test:integration:pg` — creates a PostgreSQL **temporary** wallets table on a dedicated client, forces a real integer-overflow failure on the second UPDATE, asserts the first debit is rolled back, and checks the success case commits both changes. The test fails unless `PG_TEST_URL` and `ACADEMY_ISOLATED_PG=YES` are supplied. Use a dedicated PostgreSQL 17 test database named `academy_test` or `academy_test_nest`, with an explicit restricted role/password and numeric loopback address (`127.0.0.1` or `::1`). The guard rejects connection overrides, privileged roles and privileged role membership, and checks actual session identity before writing. Never production. It does not alter permanent schemas.
- `npm run test:integration:sockets` — launches an actual Nest/Fastify/Socket.IO gateway on ephemeral loopback, authenticates two independent clients using **test-only** token-to-tenant middleware, attempts to spoof tenant identity in the client handshake and message, and asserts a tenant's events do not reach the other. The toy credentials are **not** a production authentication design.

The production-like service skeleton remains a teaching sample, not an internet-facing hardened server. These tests establish only their specific behaviors, and still require actual execution and security review.

`npm run qualify:release` runs the existing lock/install/compile/32-topic runtime suite, then both integration suites; it is **expected to fail** without a genuine lockfile and a dedicated PostgreSQL test environment. New direct dependencies `pg`, `socket.io-client`, and `@types/pg` also require fresh genuine npm lock resolution. Never hand-author lockfile integrity.

Run on an appropriate Node 24 machine:

```sh
cd examples/nestjs-vertical
npm install --package-lock-only
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL='postgres://test-user:...@127.0.0.1:5432/academy_test_nest'
npm run qualify:release
```

`npm run qualify:release` is a runtime gate, not a substitute for root Next browser/human accessibility review. None of the above commands have run in this session.

## Offline source integrity and revised transaction example

A *dependency-free* source coverage gate now runs before any npm lock/install attempt:

```bash
npm run test:source-coverage
# From repository root:
npm run test:nestjs-drafts
npm run status:nestjs-test-coverage
```

It requires each of the 32 canonical NestJS lesson IDs to be tested against its matching metadata `labSlug`, prevents accidental `test.skip`/`test.only`/`test.todo`, verifies real integration-test entrypoints, and syntax-checks suite files without loading packages. Results are **not** a claim of runtime success. The full `npm run qualify:release` remains mandatory for P2 approval.

The 11.03.06 teaching transfer now rejects missing wallets and insufficient funds by checking the result `rowCount` of each parameterized UPDATE, and preserves the failed operation if rollback also fails. It requires **one checked-out database client across BEGIN/UPDATE/COMMIT/ROLLBACK**; a pooled query convenience method that changes connections between statements is unsafe. The amount is fixed at one integer unit for instructional clarity. It is not payment-grade: do not treat the example as handling retries, idempotency, ledger entries, multi-currency amounts or reconciliation.

The real Socket.IO integration test now proves both isolation directions and reproduces the intentionally insecure student's global broadcast over a real loopback gateway. These integrations and the repaired transfer need execution on Node24 with actual dependencies. `require-lock.mjs` deliberately refuses unsupported Node runtimes.

## Reproducible no-registry test gate

Run `npm run test:offline` from this nested workspace (or `npm run test:nestjs-offline` at the repository root) to execute **26 deterministic source behavioral tests** without Nest or a database. This includes 7 transactional contracts, 11 additional backend contracts and 8 in-memory npm-lock verification tests. The `test:source-coverage` and `qualify` commands include the offline gate. The pure lock validator reports manifest structure only; package authenticity is established later by actual `npm ci`.

The Node22 test run used a temporary isolated reconstruction and passed 26/26. It **does not** establish full Nest/TypeScript/PostgreSQL/Socket.IO runtime readiness. See `docs/NESTJS_OFFLINE_QUALIFICATION_CHECKPOINT_20261121.md` for exact results and blockers.

## Module-specific qualification

From the Academy root, use `npm run qualify:nestjs:module -- --plan 11.01` to inspect the fixed steps, and `npm run qualify:nestjs:module -- --run 11.01` only with Node24.9+, genuine npm lock and approved registry access. Replace the ID with 11.02, 11.03 or 11.04. The domain module retains real disposable PostgreSQL tests; advanced retains real socket tests. `qualify:release` still runs all suites. Runtime success never grants publication or human review approval.
