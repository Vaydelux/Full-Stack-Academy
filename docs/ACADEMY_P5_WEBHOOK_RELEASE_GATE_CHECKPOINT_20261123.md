# P5 Webhook and Offline Release Gate — Security Hardening Checkpoint

**2026-11-23 · source/isolated real HTTP tests only**

## Found and repaired

1. The synthetic incoming webhook verified a HMAC of timestamp + body, but treated the **caller-supplied event ID and provider** as trusted deduplication keys, although neither was authenticated by the signature. A captured valid body/signature could be replayed with a substituted event ID. The teaching protocol now uses an explicit `p5-webhook-v2` envelope binding provider, event ID, timestamp and exact raw bytes. It does **not** claim compatibility with GitHub, Stripe, Resend or any other real vendor.
2. `WebhookInbox.accept` previously returned `duplicate` for an existing event ID even when it arrived with different correctly signed bytes. It now detects and rejects an idempotency conflict.
3. `scripts/verify-offline.mjs` had **no P5 bundle step**, so prior complete release gate execution could report success without running the latest P5 security and integration test suites. Added `test:p5-bundle` and an independent `test:release-gate-coverage` source audit. The P5 bundle now covers **16** mandatory local source/behavior suites.
4. Replaced stale `docs/RELEASE_GATE.md` figures with correct 338/889 published inventory and explicit Node24, browser, real PostgreSQL and human review requirements.

## Local executed evidence

- `node --test examples/p5-integrations/http.test.mjs`: **81/81** actual loopback HTTP/network tests, including three new header-substitution regressions.
- `node --test examples/p5-integrations/webhook-integrity.test.mjs`: **15/15** deterministic signature, scope, duplicate and negative tests.
- `node --test examples/p5-integrations/postgres-search/qualify.test.mjs`: **20/20** PostgreSQL runner/source guard tests; **not SQL execution**.
- `node --test tests/offline-contract.test.mjs`: **12/12** positive and mutation cases for the offline step matrix.
- Combined: **128/128 passing, zero skips/failures** on **Node 22.16.0**, using a partial checkout of source blobs matched to the GitHub base. 
- Modified and newly introduced local SHA-1 Git blob object IDs:
  - `labs.mjs` = `4408feb065a865063b7b3e2d020034b8bec78fbf`
  - `http.mjs` = `356181359f46df3f6641089ca2269d7be9dec632`
  - `http.test.mjs` = `6caaa70298e7ddeaa9ca19f36ad19dc40e0b3fdc`
  - `webhook-integrity.test.mjs` = `5f4168a4b9d52153d79c5e5c49f09a8936bdf3ea`
  - `offline-contract.mjs` = `9ee88b79ea8105ed7f98e1e954a5d9fd99969166`
  - `offline-contract.test.mjs` = `5ce3625f6f7fd06f43cd06053b816bc99d981fd6`

**Not executed:** complete Node24 npm ci, `verify:offline` / Next build, source checks requiring all 889 topics on disk, real PostgreSQL 17+, live email/storage/webhook APIs, durable multiple-process queuing, and human accessibility. `verify:offline` intentionally refuses Node22. No production routes, lesson registries, lockfiles, Vercel config, workflow or learner data changed.

## Handoff commands

```bash
npm ci
npm run test:release-gate-coverage
npm run test:p5-bundle
npm run verify:offline
```

Only after these pass on Node24 should you exercise all 15 real PostgreSQL search SQL assertions in a **disposable, explicitly confirmed** local database and separately check vendor-specific signatures. Real SQL/database proof and accessibility signoff are still required before any publication or production deployment.

**Curriculum accounting unchanged:** 889 canonical; 338 published, 272 authored unverified, 279 still to author.
