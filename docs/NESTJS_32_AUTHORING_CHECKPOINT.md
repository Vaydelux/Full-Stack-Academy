# NestJS 12 — 32-topic source authoring checkpoint

**Date:** November 20, 2026. **Branch:** `feat/p2-nestjs-32-authoring-20261120`.

## Tangible progress

Authored **all 32 canonical P2 topics** across four eight-topic modules:

- **11.01 Nest Architecture:** module graph, routing, providers, request scopes, environment parsing, Fastify adapter, lifecycle hooks, and API capstone
- **11.02 Request Pipeline:** middleware, Zod pipes, guards, interceptors, exception filters, response DTOs, AsyncLocalStorage, guard-order bug hunt
- **11.03 Domain Modules:** services, repository pattern, entity/DTO separation, dependency inversion, module exports, real transaction design, domain events, reusable project module
- **11.04 Advanced Nest:** injection tokens, async modules, WebSocket isolation, shutdown, provider overrides, tenant cache, health endpoints, local production-style skeleton

Each lesson is an MDX article with three guided steps, realistic negative and instructor code examples, a knowledge check, bug hunt, a distinct official NestJS reference, safety limits, and a matching `meta.json` and machine-readable `lab.json`. **160 source files** (32 articles, 32 metadata, 32 manifests, 64 TS sources) were added to `drafts/nestjs/`.

An isolated `examples/nestjs-vertical/` package targets **NestJS 12, TypeScript 6, Node 24.9+**, including eight real framework test cases (11.01) comparing instructor behavior and intentionally failed learner cases. Its tests were **authored, NOT executed**. The npm registry was unavailable in this environment; no real lockfile was generated, and its qualifying command refuses to pass without one.

## Root project isolation

The root Next.js `tsconfig.json` and ESLint config exclude the unqualified Nest 12 drafts and nested runtime harness. This keeps TypeScript 6 decorator samples from entering the existing Next/React TypeScript 5 build or being misjudged by unrelated Next lint rules. The Nest runtime package has its own compiler and semantic checks, and **must be independently qualified** before publishing. Compiled `dist/` output is ignored in Git.

## Source validation

```bash
npm run status:publication-phases
npm run status:nestjs-drafts
npm run test:nestjs-drafts
npm run verify:offline
```

Once npm connectivity and a Node24 checkout are available:

```bash
cd examples/nestjs-vertical
npm install --package-lock-only
npm run qualify
```

Commit the genuine npm lock only after actual npm resolution. Fix observed TypeScript/Nest/HTTP failures, add real positive and negative runtime tests for the remaining 24 topics, and acquire named keyboard/screen-reader/200% zoom evidence before **each** eight-topic module is published. For 11.03.06, run an isolated real PostgreSQL service; in-memory mock transactions are not acceptable proof. WebSocket isolation in 11.04.03 needs two independently authenticated sockets, not a string-search test.

## Honest completion metrics on this branch

| Metric | Source-derived value |
| --- | ---: |
| Canonical curriculum | 889 |
| Live published unique topics | **338** (unchanged) |
| Forms/Query drafts already in main | 16 |
| New P2 NestJS drafts | **32** |
| Total staged across P1/P2 in this candidate | **48** |
| Not yet drafted | **503** |
| Remaining unpublished | **551** |
| Complete published modules | **42** |

This advances **authored content**, not published counts. Avoid changing status flags, inventing runtime results or silently merging unverified lessons into live registries. Module-by-module publication still requires real package locks, source/MDX and lab verification, Next build, browser and accessibility review. P1 Forms/Query remains the first release unit (09.02 then 09.03), followed by four P2 modules when qualified.

## Handoff

- `docs/NEXT_TODO.md`: critical next actions
- `scripts/verify-nestjs-drafts.mjs`: deterministic source audit, explicit strict refusal
- `scripts/curriculum-phase-program.mjs`: now counts the P2 drafts without mistaking them for publication
- `examples/nestjs-vertical/README.md`: runtime installation procedure and security constraints

## Conflict-free P2 continuation (November 21, 2026)

The original PR #39 branched before the P1 16-lesson source-only merge, making it unmergeable. It was reconciled with a **two-parent merge commit** carrying all 169 P2-only added files forward into the exact merged P1 tree, then integrating only NestJS-specific source checks, nested build exclusions and curriculum accounting. This preserves the repository-level `vercel.json` Git deployment freeze, the linked Vercel build-skip setting, manual-only GitHub Academy workflow and all P1 release integrity guards. No NestJS lessons are in production MDX registries. Do **not** merge this P2 candidate until at least the Nest runtime dependency/lock and tests can be qualified, and do not misrepresent source audits as framework acceptance.

## November 21 continuation — request pipeline behavioral gate

Added `examples/nestjs-vertical/tests/request-pipeline.test.mjs`, wired into the isolated workspace's `npm run qualify` sequence. Six P2 11.02 topics now have authored **positive instructor / negative starter** runtime assertions:

- 11.02.01: unique correlation IDs and `next()` invocation.
- 11.02.02: Zod title trimming and malformed-input rejection.
- 11.02.03: denied missing/invalid authorization; approved teaching-only token.
- 11.02.04: RxJS interceptor must call the handler and preserve its payload.
- 11.02.05: mapped HTTP status and sanitized error response.
- 11.02.08: guard denies missing/insufficient permissions.

These are **new test sources, not executed test results**. The missing genuine npm lock and unavailable real Nest install continue to block runtime qualification. The remaining 11.02.06 and 11.02.07 require specific real tests; P2 publication remains blocked. The `main` published count stays 338/889 and Vercel Git deploy remains frozen.

## November 21 — 32-topic runtime test authoring expansion (NOT executed)

All **32 canonical NestJS draft topics** now have a corresponding authored test scenario in the isolated Node test runner:

| Module | Runtime test file | Tests authored | Qualification limitations |
| --- | --- | ---: | --- |
| 11.01 Architecture | `tests/architecture.test.mjs` | 8 | Real Nest compile, Fastify and DI remain unexecuted |
| 11.02 Request pipeline | `tests/request-pipeline.test.mjs` | 8 | Middleware, validation, authorization, interceptors, DTO redaction and concurrent AsyncLocalStorage need real runtime |
| 11.03 Domain modules | `tests/domain-modules.test.mjs` | 8 | Transaction test proves mocked SQL command flow **only**; isolated real PostgreSQL still mandatory |
| 11.04 Advanced Nest | `tests/advanced.test.mjs` | 8 | Gateway uses an in-process tenant-room contract mock, **not** authenticated two-client Socket.IO isolation; production skeleton's unsafe starter is deliberately not executed |

The 11.04.08 instructor skeleton now accepts an optional test-only ephemeral port, while continuing to bind `127.0.0.1`; the default remains 3337. This makes loopback Fastify smoke testing possible without a public socket or port collision. The starter is checked as source-only due to its deliberately unsafe `0.0.0.0` listener.

`npm run qualify` now guards the genuine nested npm lock, runs `npm ci`, typechecking, compilation and **all four runtime suites** through `npm run test:runtime`. The lock guard checks both dependency sections, root identity, resolved direct packages and integrity fields. This guard cannot replace actual npm integrity verification.

**No Node24/Nest12/TS6 compiled or executed result is claimed.** This environment cannot resolve the GitHub/npm registry and the nested npm lock is still missing. All 32 test scenarios are authored but **0/32 have been freshly executed here**. Source-only acceptance, 11.03 PostgreSQL transaction rollback, real two-tenant authenticated sockets, complete Next build, browser a11y and named human screen-reader reviews still block publication.

Run on a Node 24 development machine with the registry available:

```bash
npm ci
npm run test:nestjs-drafts
npm run verify:offline
cd examples/nestjs-vertical
npm install --package-lock-only
npm run qualify
```

After real runtime failures are fixed, commit the npm-generated lockfile and exact test evidence. Do not publish or merge this draft merely because tests have been authored. The **live count is still 338/889**, P1 must release first, and the Vercel freeze remains in force.

## November 21 — genuine service integration gates staged

Added `tests/postgres.integration.test.mjs` for real transactional rollback and commit against a **session-private temporary table**, requiring opt-in dedicated PostgreSQL credentials. This closes the prior **mock-only assertion design gap**, but actual PostgreSQL tests remain **unexecuted**.

Added `tests/websocket.integration.test.mjs` for two independently authenticated live Socket.IO clients, server-assigned tenant identity, adversarial client-provided tenant spoofing and non-delivery of cross-tenant broadcasts. Token mapping is deliberately test-only. The previously authored in-process room contract remains part of the 32-topic suite. The real connection test is **unexecuted**.

Added `pg`, `socket.io-client`, and `@types/pg` to the nested lab dependencies, and `qualify:release` to sequentially run the 32-topic suite and both live integration suites. Rebuild the genuine lockfile from npm before executing it. Source-only JavaScript parse checks succeeded for the two new files, not execution.

**Release state:** PR #39 remains draft/unmerged; main still has 338 published lessons; Vercel deployment is frozen. Runtime outcomes, dependency integrity, WebSocket isolation and real DB rollback are not yet verified, and no human a11y sign-off exists.

## November 21 — expanded quality and transaction correctness (PR #39 continuation)

**Actual code changes:**
- Added `examples/nestjs-vertical/scripts/verify-runtime-test-coverage.mjs`: a Node built-ins-only, read-only audit that maps the 32 canonical 11.01–11.04 IDs to their exact staged lab slugs and test bodies; refuses missing, duplicated, skipped, focused or misassigned coverage; checks both real-integration scripts and nested release-runner wiring; syntax-checks the six test programs. The report explicitly sets `runtimeExecuted: false`, `integrationExecuted: false`, and `readyToPublish: false`.
- Added six mutation-oriented source tests in `tests/runtime-coverage-source.test.mjs`. Mapped all 32 canonical lessons directly against their eight-topic suites and metadata through GitHub source inspection. A separate V8 evaluation of the audit function detected missing, duplicate, wrong-slug and skipped declarations in synthetic cases; the **full Node test runner is not claimed executed**.
- Wired `test:source-coverage` into nested `qualify`, and the same source gate into root `test:nestjs-drafts` (therefore root `verify:offline`). The new status command is `npm run status:nestjs-test-coverage`.
- Corrected the `11.03.06` transaction instructor source: reject same-wallet transfers before BEGIN, ensure source has a balance and exists, check both UPDATE `rowCount` values, ROLLBACK when either required wallet is absent, and preserve both original and rollback errors with `AggregateError` if rollback itself fails. Matched the original MDX instructor code fence **exactly** to the changed `solution.ts`.
- Expanded the domain test with missing source, missing destination, self-transfer and failed rollback contract cases; expanded real PostgreSQL integration test to assert these checks against a temporary table and to prove unchanged balances.
- Strengthened the live Socket.IO test: two-way Alice/Bob tenant separation, spoofed tenant fields, invalid payloads, rejected unauthenticated connections, and an explicitly run intentionally vulnerable student gateway proving cross-tenant leakage. Only local ephemeral loopback ports are used.
- Nested lock validator now rejects non-Node 24.9+ toolchains instead of merely relying on the package engine declaration.

**Evidence and limitations:** New files were parsed as JavaScript source, source/MDX parity was checked, and 32/32 topic-to-slug associations were checked via GitHub contents. This session has local Node 22 and no GitHub/npm DNS, so **no real `npm ci`, TS6 compile, Nest HTTP tests, PostgreSQL integration, Socket.IO runtime tests, Next production build, Chromium browser test, or named human accessibility review was completed**. The absence of a true npm-generated nested lock continues to block the release gate.

Next acceptance: on a trusted Node 24 checkout, run `npm ci && npm run test:nestjs-drafts && npm run verify:offline` from the root; in `examples/nestjs-vertical`, run `npm install --package-lock-only`, commit the real lock, configure a disposable `PG_TEST_URL` with `ACADEMY_ISOLATED_PG=YES`, then run `npm run qualify:release`. Fix *observed* compiler/runtime failures before promotion; do not bypass failing assertions or invent evidence.

**Freeze remains:** 338/889 live lessons, PR #39 draft/unmerged, P1 RHF then Query before any P2 publish, Vercel deployment disabled.

## Expanded dependency-free offline qualification — November 21

Added and committed three runnable Node-built-in tests: `transactions.offline.test.mjs` (7), `pure-contracts.offline.test.mjs` (11) and `lock-integrity.offline.test.mjs` (8). These exercise actual TS instructor and starter files where possible without installing Nest; the lock tests use in-memory fixture objects and **do not generate a fake lock**. The pure manifest validator is shared with the release lock guard, which still refuses unsupported Node versions and requires a genuine npm lock plus `npm ci`.

All 26 tests passed locally in a temporary reconstructed subset on Node22. This is reproducible **behavioral evidence**, but not a full checked-out Node24 qualification, and it does not change any publication flags. See [complete offline checkpoint](NESTJS_OFFLINE_QUALIFICATION_CHECKPOINT_20261121.md).

## November 22 — security repairs and complete instructor-source parity audit

The teaching implementations for 11.04.03 WebSocket, 11.04.06 cache, and 11.03.01 service were repaired for malformed JSON, per-user/tenant response isolation with mutation invalidation, and explicit bad-request handling. All three lesson MDX code fences were updated in lockstep; 11.04.08's earlier stale instructor bootstrap was also reconciled. A fresh direct GitHub inspection verified the second TypeScript code fence in **every one of the 32 lessons** exactly matched its checked-in solution source.

38 assertions on the exact-blob TS sources passed after transpiling with locally available TypeScript 5.8 and minimal Nest/RxJS mocks (11 WebSocket, 12 cache, 15 domain service). No Node24/Nest12/TS6, real Socket.IO network or database claims are made. See [detailed security checkpoint](NESTJS_20261122_SECURITY_SOURCE_QUALIFICATION.md), including blob IDs and the remaining clean-machine qualification.
