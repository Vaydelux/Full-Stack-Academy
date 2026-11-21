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
