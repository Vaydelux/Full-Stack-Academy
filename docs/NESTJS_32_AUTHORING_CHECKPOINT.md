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
