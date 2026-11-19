# Node.js 24 + HTTP API Fundamentals — Full Vertical Slice Acceptance

**Date:** 2026-11-19 · **Branch:** `feat/node24-http-api-vertical-slice` · **Base:** draft PR #23 `feat/zustand5-state-boundaries-live` at `e6b3c8f`, itself stacked on draft PRs #22, #21 and #20.

## Accomplished source scope — 16 complete lessons

`10.01.01–10.01.08` Node Runtime: event loop/microtasks and worker threads, bounded environment variables, real Readable/Buffer byte limits, fetch and AbortSignal, filesystem realpath containment, actual process memory/CPU sampling, graceful signal cleanup, and incremental crypto-hashed upload.

`10.02.01–10.02.08` HTTP APIs: method/status mapping, Accept negotiation, bounded defensive JSON parsing, idempotency keys and concurrent replay deduplication, filter/sort/paginate, RFC 9457 Problem Details, ETag and If-None-Match 304, and a real Node HTTP server capstone.

Each topic includes an authored MDX article with three guided implementation steps, mental model, misleading starter and corrected instructor, precise local Node assertions, negative cases, misconception, quiz, debugging rubric, official source links, and a lab manifest. Labs execute **Node core modules and Fetch/Response**, not mocked external API libraries.

## Real loopback capstone and evidence

- `labs/http-local-rest-contract/solution/solution.mjs` uses `node:http` and `node:crypto` with in-memory records, 409 replay conflicts, 201 creation, 404/405/415/422/413 status responses, JSON limits, ETags, and Problem Details.
- `labs/http-local-rest-contract/solution.test.mjs` starts the server on port 0 at 127.0.0.1 and uses actual `fetch` calls, then closes the server.
- **Executed successfully locally on Node.js 22.16.0**: original HTTP wire test passed (1/1) and separate manual HTTP requests returned intended statuses for missing idempotency key (400), bad limit (400), bad JSON (400), extra field (422), oversized body (413). No Node.js 24 run has been performed.
- The expanded acceptance test now includes all those negative cases, but **this expanded exact test file has not been re-executed** after its GitHub source update.
- This API is intentionally **UNAUTHENTICATED**, **IN MEMORY**, and must not be deployed publicly. Persistence, real idempotency transactions, tenant authorization, CSRF/CORS, quotas, rate limits and audit logs are still separate production requirements.

## Proposed cumulative checkpoint (source, not hosted)

- 889 canonical lesson IDs over 111 modules and 28 tracks
- **322 unique published lesson IDs**, **321 authored MDX lessons**, **321 local lab manifests**
- **40 complete modules** (new 10.01 and 10.02), **38 authored API reference drafts of 303 indexed subjects**
- **567 catalog topics remain planned**. First not-yet-authored canonical topic is **09.02.01** (React Hook Form), although this independently runnable Node track is authored out of order
- Five stacked draft development PRs must be qualified and integrated in order

## Quality gates

Local dependency-free runtime command:

```bash
npm run test:node-http
npm run test:red-node-http
```

Full release gates on an exact Node.js **24** checkout with locked dependencies:

```bash
npm ci
npm run verify:offline
```

Then locally serve Next.js and run the isolated Chromium harness including `scripts/node-http-track-smoke.mjs` for 16 lesson routes, canonical sitemap, noindex 09.02.01, and mobile overflow. Review screenshots, screen readers, reduced motion, keyboard, quiz/lesson progress persistence and browser console errors.

**Not done:** full `npm ci`, repo-wide lint/tsc/content/Next build, all 321 lab executions, all red-starter suites, exact Node.js 24 check, live/hosted deployment, accessibility certification. Direct DNS access to GitHub/npm is blocked in the container; GitHub connector source checks are not executable release qualification. No Vercel or GitHub Actions inspection was performed.

## Next large-scope integration

`10.03` Security Boundaries: 8 lessons (TLS proxies, CORS vs CSRF, cookies/tokens, rate limiting, size limits, SSRF, redaction, insecure endpoint capstone). `10.04` OpenAPI & SDKs: 8 lessons with real OpenAPI 3.1 schema fixtures, contract compatibility and a generated-client exercise. **Add real security and HTTP contract integration tests**, not just code snippets.

Then 11.01–11.04 NestJS architecture (32 lessons), 12.01–12.05 SQL/Postgres (40), 13.01–14.04 Prisma and Supabase (64), in cohesive module families. Do not label those modules delivered until their real dependencies, fixtures, builds and negative tests execute.

**Owner delivery preference:** no Vercel or GitHub Actions checks. Favor coherent 2–8-module passes, one checkpoint and reviewable milestones; do not use a missing cloud gate as an excuse to skip all local quality evidence.

**First unblocking action:** obtain full Node 24 checkout, run independent `test:node-http`, then full `verify:offline`, and qualify PRs #20 → #21 → #22 → #23 → current PR.
