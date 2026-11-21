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
