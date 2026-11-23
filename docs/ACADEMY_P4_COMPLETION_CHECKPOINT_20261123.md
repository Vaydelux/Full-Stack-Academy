# P4 Prisma + Supabase Completion Checkpoint

**Date:** November 23, 2026  
**Repository:** `Vaydelux/Full-Stack-Academy`  
**Scope:** Stage the last 24 canonical P4 topics with reviewable source and negative-case tests, **without a production deployment**.

## Course progress: canonical source accounting

| Measure | Count | Interpretation |
|---|---:|---|
| Canonical lessons | **889** | Defined by `data/curriculum.json`; unchanged |
| Published lessons | **338** | Learners can open and complete them; unchanged |
| Authored drafts | **152** | P1 Forms/Query 16 + P2 NestJS 32 + P3 PostgreSQL 40 + P4 Prisma/Supabase 64 |
| Not yet authored | **399** | Topics remaining beyond existing manuscripts |
| P4 authoring | **64/64** | All eight P4 modules have eight source-authored lessons |
| Newly authored here | **24** | Modules 13.03, 13.04 and 14.04 |
| Runnable isolated regression tests | **8 passed** | Upload intent only; Node 22.16.0, no Supabase connection |

`338+152+399=889`. `338+152=490` lessons are source-authored (55.1%) but the learner-accessible course remains **338/889 (38.0%)**. An authored draft is *not* a published, executable or runtime-qualified lesson.

## Work committed

- **13.03 Advanced Persistence (8):** safe raw SQL parameters, PrismaPg pooling, migration histories, expand–backfill–contract, multi-schema models, sanitized query telemetry, typed repositories and a migration-drift bug hunt.
- **13.04 Supabase Integration (8):** SQL connection modes, pooler/direct selection, Grants and RLS, least-privileged Postgres roles, NestJS authorization, migration ownership, two-user isolation testing and a cross-tenant Prisma/RLS bypass capstone.
- **14.04 Storage & Realtime (8):** private buckets, signed upload URLs, MIME/size validation, private Realtime authorization, Postgres Changes subscriptions, Presence/Broadcast policies, authenticated idempotent webhooks and a PENDING→READY private-document capstone.
- All lessons use MDX learning goals, three guided steps, one broken and one corrected checked-in code source, a misconception, knowledge check, official references, JSON metadata and a separate real-runtime positive/negative acceptance plan. No P4 lesson is registered as published.
- Extended `examples/p4-foundations/scripts/verify-source.mjs` and its test suite from five modules / 40 drafts to all eight modules / 64 drafts.
- Updated the publication-phase regression test to demand 64 canonical P4 topics without hard-coding the global count in a way that would break legitimate future publication.

## Real evidence recorded

1. All **24 newly authored** lesson MDX snippets were fetched from GitHub and directly compared with their checked-in starter and instructor files. **24/24 source pairs matched**, with three guided steps in every lesson.
2. Audited representative new metadata, lab manifests, and acceptance documents for title/slug agreement, explicit `draft-unverified`/`readyToPublish=false`, an actual negative case and non-executed status.
3. Added a pure Node private-upload intent helper with eight negative and positive tests. **8/8 passed** locally under Node 22.16.0 using `node --test`. Blob hashes of the tested files precisely matched the GitHub source blobs: helper `9b60656c5b6be690a85d6989a6560c55aaabbac4`, test `51562daa30526424138998e19fa06d7e0908d824`.
4. Security review fixed an unsafe independently-supplied webhook event object: the webhook snippet now parses only the HMAC-verified raw body. The upload capstone now validates the document ID format before constructing the private object path.
5. A read-only source verifier is wired into `npm run test:p4-source`; **its full repository execution was not performed in this environment**. The full Node24/Next/Prisma/Supabase/browser test matrix remains blocked, and no claim of RLS or runtime qualification is made.

## Security boundaries

Source lessons teach security concepts but are not security proof. A signed upload token is a bearer capability; clients cannot choose owner/tenant object paths. MIME declarations do not validate bytes, Storage and Postgres do not share one ACID transaction, and a Realtime filter does not replace private-channel RLS. Privileged Prisma SQL roles do not magically adopt the browser's JWT/RLS context. Webhook HMAC shown in 14.04.07 requires a **separately configured trusted signing gateway**; Supabase Database Webhooks should not be assumed to emit that signature.

**Do not deploy intentional red starters.** Treat all P4 source files as teaching materials requiring actual operator/security review.

## Next operator checklist

1. On a real Node24 checkout: `npm ci`, `npm run test:p4-source`, `npm run test:publication-phases`, `npm run test:course-roadmap`, then `npm run verify:offline`. Capture actual CLI outputs and fix observed failures.
2. Pin Prisma ORM v7 with the appropriate PostgreSQL adapter, authentic lockfile and generated client; run schema, migration, tenant CRUD/transaction and raw SQL negative cases in a disposable PostgreSQL environment.
3. Start a **local Supabase** stack only; validate JWT/SSR/RLS for anon and two authenticated users, including SQL role bypass and known cross-tenant IDs.
4. Validate private Storage rules, signed URL issuance/use/expiry, independent file-byte scanning, private Realtime join/send restrictions and webhook gateway signature/replay paths.
5. Run Next production build, browser responsive and accessibility matrix and named human review. Only release individually qualified lessons in the approved P1→P2→P3→P4 program.
6. Proceed authoring the remaining **399** canonical non-P4 topics; prioritize short practical integrated paths, not bulk publishing of untested lessons.

## Deployment freeze

`vercel.json` retains `git.deploymentEnabled=false`, workflows remain manual-only and published registry/checkpoint are unchanged. Merging this source-only PR must not intentionally trigger a Vercel deployment.
