# P5 Redis/BullMQ Track 16 — implementation checkpoint
**Date:** 2026-11-23

## New implementation

- Authored **32 separate unpublished MDX lessons** (16.01.01–16.04.08) from the canonical curriculum, across Cache Design, Redis Operations, BullMQ Fundamentals and Reliable Async Architecture.
- Created a dependency-free tenant-scoped cache-aside lab with bounded TTL/LRU-style memory store, generation-aware invalidation, concurrent singleflight, defensive copies and hit/miss/load metrics.
- Created a dependency-free at-least-once outbox and worker simulator with leases, bounded retries/backoff, dead state, manual redrive and local single-process idempotent effects.
- Added **32 runnable Node lab tests** (16 cache + 16 outbox), and a 32-topic catalog/manuscript safety verifier with **10 negative/mutation tests**.
- Added root npm scripts, instructor notes and explicit publication blockers.

## Actual evidence

- On local Node.js **22.16.0**: **42/42** source/lab tests passed in the isolated source directory; both new source modules and source auditor were parsed/executed.
- All six staged GitHub JS/test source blobs were compared with exact local Git hashes before merge.
- All 32 drafted manuscripts were constructed from the current canonical Track 16 titles and checked for exact ID, module, title, draft status, three guided steps, knowledge check, and source references.
- This is **not** a real Redis or BullMQ integration. A process-local Map and outbox are educational simulations only. No claim of durable queue recovery, multi-worker coordination or production cache authorization is made.
- Full Next.js Node24 build, accessible browser acceptance, Redis/BullMQ runtime integration and the existing P1–P5 publication gates are **unverified**.
- Docker and PostgreSQL still unavailable in this authoring environment; the prior P5 security database gate remains blocked.

## Curriculum accounting

Before this change: 338 published, 184 authored/unpublished, 367 unauthored = 889 canonical.
After source-only Track 16 authoring: **338 published**, **216 authored/unpublished**, **335 unauthored**, still **889** canonical topics. Source authoring increases; publication does not.

Track 15 security and Track 16 Redis/BullMQ are now source-authored. Tracks 17–18 remain to be written within the larger P5 phase.

## Follow-up priorities

1. Run `npm run test:p5-cache-jobs && npm run test:p5-redis-source` in a real Node24 checkout, plus `npm run verify:offline && npm run build`.
2. Add an isolated Redis instance and an independently locked BullMQ package to verify real TTL, worker retries, duplicate delivery, job recovery, queue shutdown, and tenant key separation; store exact logs and versions.
3. Execute the previously implemented PostgreSQL 17 security container qualification and fix real SQL/RLS errors (source tests do not prove SQL behavior).
4. Extend authoring to Track 17 Realtime & Collaboration with separate simulated/live qualification and maintain strict publication separation.
5. Only publish sequentially after P1–P5 runtime, editorial, accessibility and security gates pass.

Vercel automatic deployment remains disabled. GitHub workflow configuration remains manual-only.
