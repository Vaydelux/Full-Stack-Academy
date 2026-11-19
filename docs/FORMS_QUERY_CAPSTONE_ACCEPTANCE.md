# Forms + Query capstone — source milestone acceptance

**Date:** 2026-11-19
**Feature branch:** feat/forms-query-real-http-capstone-20261119

## What is actually implemented

- Real loopback HTTP task server (Node built-ins only), API client, and HTML/CSS/JS practice application on the same origin.
- Task creation (strict JSON body/known fields, normalized title and enumerated priority), idempotency replay/conflict handling, deletion, cursor-based list pagination with stale-cursor detection, health check, request-size/capacity limits.
- Loopback-only binding, Origin guard, static-file allowlist, restrictive CSP/nosniff, no arbitrary HTML rendering, no secret or user account claims.
- Standalone *separate* Vite + React sample importing genuine react-hook-form, @hookform/resolvers/zod, @tanstack/react-query and Zod 4. It is NOT yet built or published and is not imported by the academy root bundle.
- 16 canonical (09.02 and 09.03) learner workbook entries: goals, guided exercises, misconceptions/bug hunts, acceptance and official references. Workbook is not 16 complete MDX lessons/labs.
- Corrected 16 planned catalog entries that had incorrectly linked to Zod's docs for RHF and TanStack Query topics.
- Added 'test:forms-query-http' to root scripts and offline local verification. **No root dependency or package-lock changes**.

## Verified local evidence (real execution)

- **PASS 22/22** Node 22.16.0 network integration tests using 'node --test tests/forms-query-http.test.mjs' with actual HTTP requests to an ephemeral loopback listener. Cases: body validation and limits, malformed JSON, unsupported fields, stable ID/createdAt, same-key idempotency, key conflict, 403 origin denial, invalid/stale cursor, multi-page listing, DELETE, client URL constraints, AbortSignal cancellation, bounded capacity, static HTML/CSS/ESM, Content Security Policy, no wildcard CORS and unknown path denial.
- **PASS** 'node --check' for loopback server and browser client modules.
- **PASS syntax-only** TypeScript 5.x transpilation of all five standalone Vite/React .ts/.tsx files using globally installed TypeScript; this does not assert library types or runtime behavior.
- Exact GitHub server blob after Windows CLI fix: fa3b2d8ec3071580a275d34be9fd0b2fce42edb8, matches the local source executed for the 22 HTTP tests.
- Exact committed HTTP test blob matches the local file in the test runner: be752c02772c4700783f267362d300b1b08e0a06.
- React packages could not be fetched: npm registry and github.com DNS were not resolvable in the local sandbox. No fabricated npm integrity hashes or package-lock were added.
- A Chromium headless launch was attempted but stalled in this environment; no claim of successful browser UX/a11y qualification.

## Not verified

- Nested React 'npm install', actual package peer-compatibility, 'npm run typecheck', build, form submit/keyboard/a11y or TanStack rollback in a real browser.
- Full Node 24 root 'npm ci && npm run verify:offline', Next.js production compilation and all earlier lessons/lab suites.
- Browser runtime visual/interaction checks for the native practice page at 320px, 768px, desktop, zoom/reduced-motion or screen reader.
- Cross-session durability, authentication, authorization, rate limiting or audit logging (not implemented; this is an ephemeral single-user educational API).
- True concurrent optimistic mutation rollback; the draft React UI deliberately disables concurrent deletes and its first-page-only list should not be described as a complete infinite-query example.
- Canonical MDX, metadata, instructor/red learner code and 16 executable library-specific labs (still planned).

## Requirements before publishing 09.02 and 09.03

1. Resolve real compatible dependencies from npm on a complete Node 24 checkout and generate a trusted npm-created package-lock. Do not edit integrity strings by hand.
2. Run the standalone React typecheck/build and locally instrumented browser tests with real RHF and Query.
3. Complete 16 independent canonical lesson/metadata/instructor/starter/negative-test/rubric bundles from the workbook; register only after they pass.
4. Re-run the existing whole-site offline gate plus keyboard/screen-reader/responsive acceptance. Compare exact merged SHA.
5. Check dev dependency security exception due **2026-12-02 UTC** before a production release.
6. Do not deploy the teaching server publicly. For a real deployment replace memory, unauthenticated writes and CORS assumptions with tenant-bound identity, persistent transactions, rate limits, audit records, TLS and explicit egress controls.

## Runbook

See examples/forms-query-vertical/README.md and examples/forms-query-vertical/WORKBOOK.md. No Vercel or GitHub Actions checks were invoked in this milestone.
