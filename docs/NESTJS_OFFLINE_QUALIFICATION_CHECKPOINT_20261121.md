# NestJS 12 offline behavior and release qualification checkpoint

**Date:** November 21, 2026. **Branch:** `feat/p2-nestjs-32-authoring-20261120`, PR #39 (draft).

## Purpose

Separate **real, dependency-free behavioral checks that can run today** from the
**full Node 24 / NestJS 12 / PostgreSQL / Socket.IO gates that have not run**.
Do not interpret a passing offline fake as real PostgreSQL transaction evidence.

## Real checks executed in this session

The local sandbox has Node.js **22.16.0**, npm **10.9.2**, and no working GitHub/npm DNS.
A temporary, isolated reconstruction of the relevant draft TS examples and new
test files was executed via Node's built-in TypeScript support. The source was
also committed to the PR. Results from the local reconstruction:

| Suite | Result | What it establishes |
| --- | ---: | --- |
| `transactions.offline.test.mjs` | **7/7 pass** | Source transfer contract, rollback, missing/insufficient wallets, intentionally broken starter |
| `pure-contracts.offline.test.mjs` | **11/11 pass** | SQL parameter binding, public DTO/response field boundaries, concurrent AsyncLocalStorage, event ordering, negative starters |
| `lock-integrity.offline.test.mjs` | **8/8 pass** | Fail-closed manifest guard mutations against *in-memory synthetic fixtures* (no lockfile created) |
| **Total** | **26/26 pass** | Local behavior and guard verification only |

The `pure-contracts` suite uses `--experimental-transform-types` because
several teaching examples use TypeScript **parameter properties**; plain
`--experimental-strip-types` cannot execute those constructs on Node 22.
The transaction suite uses type stripping because its examples require no
runtime TypeScript transformation.

**Scope limitation:** These checks were performed on a temporary reconstruction,
not a fresh complete Git checkout, so they do not certify root-workspace source
integrity, TypeScript 6 compilation, NestJS 12 execution, or publication readiness.
The permanent PR scripts will re-run the tests against the actual checkout.

## Commands now committed

From the repository root:

```sh
npm run test:nestjs-offline
npm run test:nestjs-drafts
npm run status:nestjs-test-coverage
```

From `examples/nestjs-vertical`:

```sh
npm run test:offline
npm run test:source-coverage
```

All three new offline suites use Node built-ins and draft TS, **without Nest, npm
installation, real databases, or credentials**. The source coverage gate is also
responsible for verifying the 32 canonical topic-to-test mappings.

## Full trusted-machine release gate (not run here)

Use a clean **Node 24.9+** workspace with npm registry access and a disposable
PostgreSQL database. Do not use production credentials. Never invent a lockfile
or copy synthetic test fixtures into `package-lock.json`.

```sh
# Repository root:
npm ci
npm run test:nestjs-drafts
npm run verify:offline

# Isolated NestJS package:
cd examples/nestjs-vertical
npm install --package-lock-only
npm run qualify

# Only with a separate disposable PostgreSQL database configured:
# ACADEMY_ISOLATED_PG=YES
# PG_TEST_URL=postgres://.../academy_test
npm run qualify:release
```

On Windows PowerShell, set the test connection only in your current terminal
session using `$env:ACADEMY_ISOLATED_PG='YES'` and `$env:PG_TEST_URL='...'`.
Avoid saving database passwords to committed source files or test logs.

The real PostgreSQL integration must validate rollback and row-count behavior;
the real Socket.IO suite must validate authenticated Alice/Bob room isolation
and reproduce the insecure learner starter broadcast. Both currently remain
**authored but unexecuted** in the present session.

## Release rule and next work

- Keep **338/889** unique lessons published until the required gates are actually verified.
- Keep P1 RHF 09.02 and Query 09.03 ahead of P2 for publication order.
- Fix any observed Node 24, npm, TypeScript, runtime, browser or accessibility failures before promotion.
- A human must perform named screen-reader, keyboard, 200% zoom and reduced-motion review.
- Leave PR #39 **draft and unmerged**; keep the Vercel deployment freeze and manual-only GitHub workflow.

This checkpoint reports observed work only. Do not mark an unexecuted gate as green.
