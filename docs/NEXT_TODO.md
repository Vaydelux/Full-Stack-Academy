# Full-Stack Academy — Next TODO

**Batch:** JS + TS whole tracks, 64 new lessons, 8 new complete modules · **Branch:** `feat/js-ts-two-track-offline` · **Status:** offline candidate, **no Vercel deployment**, no merges.

## P0 — Exact-head qualification of 03 + 04 tracks

- [x] `03.01` Language Essentials (8), `03.02` Intermediate JavaScript (8), `03.03` Asynchrony & Runtime (8), `03.04` Browser Interaction (8).
- [x] `04.01` TypeScript Language Foundations (8), `04.02` Advanced Types (8), `04.03` Runtime Boundaries (8), `04.04` Maintainable TS Projects (8).
- [x] Author 64 new structured MDX lessons, metadata, offline intentionally defective starters, repaired instructor modules, tests and strict TypeScript examples.
- [x] Browser Interaction track additionally includes real local HTML pages with native controls, event delegation, safe text output, tabs, URL state, browser storage, and performance entry recording.
- [x] Advanced TypeScript labs include compiler-negative assertions using `@ts-expect-error`; selected tooling labs include real tsc declaration output in tests. Zod validation runs offline.
- [x] Register 64 MDX modules and metadata, lab commands, Chromium browser verification, machine checkpoint.
- [ ] Run exact-head CI (**no Vercel deployment**): lint, TypeScript strict typecheck, repository tests, content validation, checkpoint, all labs, Next production compilation in GitHub and Chromium across new and existing lessons.
- [ ] Fix failures and rerun; do not weaken tests to hide defects or silently skip inaccessible browser behaviors.
- [ ] Keep this batch as a draft PR and **unmerged** while release hold is active; production still has 61 lessons.

## P1 — Next larger coherent batch, after current tests pass

- [ ] Track `05` Git, Collaboration & Monorepos (3 modules, 24 lessons).
- [ ] Track `06` React Fundamentals & Mental Models (5 modules, 40 lessons), including existing interactive sample parity.
- [ ] Track `07` Next.js App Router & SEO (5 modules, 40 lessons).
- [ ] Work in one **104-lesson delivery program with track-level checkpoints**; do not claim all 104 lessons exist until individually authored, tested and reviewed.
- [ ] Continue tracks `08`–`27` with real reference and capstone evidence.
- [ ] Expand reference encyclopedia: 303 indexed, only four authored draft pages.
- [ ] Re-evaluate 14 high dev-only Picomatch reports before temporary exception expiry 2026-12-02 UTC.

## Release gate (deliberately paused)

- [ ] Resume Vercel only on explicit owner authorization; prior project settings use ignored build step `exit 0` and disabled preview deployments.
- [ ] Review a staged release only after deployment resume; do not merge an unreviewed or failing PR.
- [ ] Perform real-device keyboard/screen reader testing, browser storage policy review, actual performance profiling and accessibility QA.
- [ ] Distinguish counts: branch includes 154 MDX bodies, 157 published IDs, 154 lab fixtures, 19 complete modules; **live production remains 61 IDs**.

See `docs/LONG_SCOPE_DELIVERY_PLAN.md` and `docs/JS_TS_BATCH_ACCEPTANCE.md` for handoff and gates.
