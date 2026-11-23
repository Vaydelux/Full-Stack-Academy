# Full-Stack Academy — Local Release and Publication Qualification

**Current audit: 2026-11-23.** This document supersedes its previous 2026-11-18 baseline text. It is a release contract, not an attestation that the gate has completed.

## Verified source-of-truth inventory

- **28 tracks, 111 modules and 889 canonical topics.**
- **338 published unique lesson IDs** (337 published MDX and one distinct interactive publication), **272 unpublished authored drafts**, **279 not yet authored**.
- Source-only chapters, code labs, local HTTP fixtures and PostgreSQL SQL scripts **are not published lessons** until all of their publication gates pass.
- `docs/checkpoint.json` records the last verified historical hosted application baseline separately from ongoing unreleased source work.

## Mandatory release qualification (offline and Node 24)

1. Checkout the exact candidate Git SHA on a clean local machine with an actual Node 24.x runtime, npm and compatible lockfiles; record the tested commit.
2. `npm ci`, then `npm run test:release-gate-coverage` and `npm run verify:offline`. The offline runner includes all **16 required P5 source/HTTP/security subchecks** via `npm run test:p5-bundle`, plus prior-phase tests, lint, typecheck, and production build. Any missing script or failed command must stop the gate.
3. Run real isolated PostgreSQL 17+ opt-in qualification for the SQL labs, and a genuine NestJS/Prisma/Supabase runtime with least-privilege, real authorization and denial cases. A mocked SQL test or an in-memory model does not count as database acceptance.
4. Validate P1 RHF/TanStack Query and P2–P5 real dependency lock integrity, positive and negative starter behavior, and server-side rendering/hydration.
5. Run browser smoke against the built app, keyboard navigation, mobile/TV or specified responsive viewports, 200% zoom, and **human screen-reader review**. Automated source assertions do not constitute accessibility signoff.
6. Audit actual provider-specific webhook signatures, DNS/authenticated transactional email, storage scanning/quarantine, durable outbox/inbox and crash/restart behavior before promoting those topics.
7. Publish only an entire validated eight-lesson module via an atomic reviewed promotion. Both lesson registries, labs, metadata, index/sitemap, checkpoint and deployed content must reconcile exactly. Separate publication from curriculum planning and learner progress.

## Freeze and security

- `vercel.json` deliberately keeps `git.deploymentEnabled=false`. Do not re-enable, deploy, run Actions or claim a hosted release from a source-only merge.
- The track-18 webhook teaching protocol signs the exact body, timestamp, provider **and event ID** with an explicitly versioned HMAC envelope. It is **not** a compatible replacement for an external provider's own signature specification. A real adapter must use the vendor's documented algorithm.
- A local HTTP server with synthetic sessions is not a production identity provider, and in-memory queues cannot guarantee durable delivery or exactly-once external side effects.
- Review existing dependency-audit exceptions before their recorded expiration. The prior dev advisory exception expires **2026-12-02 UTC** and must not be silently renewed.
- Do not run deliberately untrusted learner code on the trusted Next origin. Preserve isolated preview execution, private data boundaries, and local-first, free-tier-conscious fixtures.

## Honest current evidence

The latest P5 webhook and release-matrix implementation passed **81 real Node 22 loopback HTTP tests, 15 focused webhook integrity cases, 20 PostgreSQL runner/source guards and 12 release-matrix mutation tests** (128 total) on an isolated partial checkout. It has **not** executed real PostgreSQL SQL, the complete 889-topic checkout under Node24, full Next build or manual accessibility testing.

The default `verify:offline` command explicitly refuses Node 22; a passing isolated test suite **does not** turn that refusal into a full release pass.
