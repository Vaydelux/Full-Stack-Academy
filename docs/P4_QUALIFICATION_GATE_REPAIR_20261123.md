# P4 qualification gate repair — 2026-11-23

**Repository:** Vaydelux/Full-Stack-Academy  
**Status:** Source-only safeguards repaired and independently unit-tested; production qualification remains blocked.

## Defects corrected

1. **Stale published count** — P4 verification previously rejected any published count other than 338. The verifier now reconciles actual published interactive IDs and published MDX metadata against the checkpoint and canonical 889-topic catalog, deduplicating legitimate overlap. Later approved P1/P2/P3 lesson publications can increase the count when their checkpoint is updated. Any unreviewed P4 draft registered as published is still rejected.
2. **Nonfatal toolchain mismatch** — The offline release command previously only warned about Node != 24. It now refuses to execute the release matrix outside Node 24, before launching npm scripts. Standalone authoring and individual compatible Node tests remain available on other versions.
3. **Outdated P4 CLI status** — The source verifier now reports 64 total manuscript lessons, not 40.

## Evidence actually collected

- **Node v22.16.0** ran the two new focused test suites: **11 tests passed, 0 failed**. They cover overlap deduplication, legitimate subsequent publication, stale published/MDX counts, malformed, duplicate and noncanonical IDs, Node24 acceptance and Node18/20/22/25 denial.
- Local test/helper file SHA-1 Git blob hashes were independently matched against the files committed on this feature branch, proving the tested material is the committed source.
- Against the real GitHub tree and source registry: **337 MDX metadata files + 4 interactive IDs − 3 shared IDs = 338 unique published lessons**. The new reconciliation logic accepted the real checkpoint and rejected a simulated stale count of 339.
- The modified verifier and offline gate passed JavaScript syntax parsing. There are no new npm dependencies or lockfile modifications.

## Remaining blockers

The current sandbox has **Node22 only**, no local repository checkout, PostgreSQL client, Docker or Supabase local stack, and no working DNS connection to clone GitHub or install missing packages. As a result, the **full Node24 npm ci, test:p4-source on the entire repository, verify:offline, Next production build, real Prisma ORM7/PostgreSQL tests, Supabase Auth/RLS/Storage/Realtime tests, browser tests and human accessibility review were not executed**. Source parity and standalone tests are not substitutes for those gates.

## Commands on a complete Node24 checkout

```sh
npm ci
npm run test:release-runtime
npm run test:p4-source
npm run test:publication-phases
npm run test:course-roadmap
npm run verify:offline
```

After the local source/build gates pass, qualify a disposable PostgreSQL/Supabase environment with two real synthetic users and denied cross-tenant tests. Do not run intentionally broken learner starters against production.

**Release freeze:** No changes to `vercel.json`, GitHub workflows, canonical curriculum, published lesson registry or checkpoint. Progress remains **338 published + 152 authored drafts + 399 unauthored = 889**.
