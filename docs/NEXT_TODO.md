# Full-Stack Academy — Active development handoff (2026-11-19)

## Real source status

- **All PRs #20–#26 are merged into main.** #20–#25 consolidated 6 stacked curriculum source layers; #26 delivered the local learner dashboard.
- The next study-planner feature branch adds a prerequisite-aware, budgeted queue to /learn/dashboard, nine locally run pure-model tests, offline verification wiring, and a 16-topic dependency-backed forms/query design specification.
- Source checkpoint *before* this branch: 338 published unique IDs, 337 MDX lesson/lab pairs, 42 completed modules, 38 authored reference drafts, 303 indexed reference topics, 889 total catalog topics, 551 still planned.
- 09.02 React Hook Form and 09.03 TanStack Query are still **planned/noindex**. Node 24 package resolution could not run because registry and clone DNS were unavailable. No false dependency locks were added.
- **No Vercel or GitHub Actions checks.** Full Next install/build/browser quality gates are still outstanding and are not implied by source merges.

## This milestone: study session planner

- [x] Pure and deterministic prerequisite-aware lesson planner against published catalog only.
- [x] Start unfinished work, estimate session duration, and support focused module selection.
- [x] Support 15/30/45/60/90-minute budgets, bounded queue, blocked prerequisites and stretch goals.
- [x] Integrate at /learn/dashboard with responsive course links and visible self-assessment disclaimers.
- [x] Reuse local learner store without new persisted profile data or remote access.
- [x] Run nine actual local Node 22 tests on exact Git SHA-matched source; strict typecheck the pure helper.
- [x] Wire npm run test:study-plan into the offline script.
- [x] Record honest evidence in docs/STUDY_PLANNER_ACCEPTANCE.md.

## Next large cohesive milestones

1. **P0 — Local release qualification:** on a full Node 24 checkout, npm ci && npm run verify:offline. Then local Chromium desktop/320px, keyboard/focus/zoom, screen reader, backup restoration, and study planner interaction checks. Review dev-only Picomatch exception before 2026-12-02 UTC; fix confirmed failures rather than ignoring them.
2. **P1 — 09.02 and 09.03:** 16 actual React Hook Form/TanStack Query lessons with live installed and lockfile-pinned dependencies, working local HTTP UI capstone, error/abort/retry/optimistic rollback tests. Canonical details: docs/FORMS_QUERY_NEXT_MILESTONE.md. Keep planned until proven.
3. **P2 — NestJS 11.01–11.04:** 32 lessons, genuine locked Nest modules, DI/auth boundary, request pipeline and loopback integration.
4. **P3 — PostgreSQL 12.01–12.05:** 40 lessons, actual database service, migrations, query plans, transaction/concurrency and rollback.
5. **P4 — Prisma/Supabase 13–14:** 64 lessons, generated clients, schema migration, policy/RLS-denial, real auth/storage boundaries.

## Evidence and open blockers

- [x] Study-plan helper: strict isolated TypeScript check and 9/9 executed Node 22 test assertions.
- [ ] Entire app npm ci, lint, typecheck, existing 337 lab suites, negative starter gates and Next build on Node 24.
- [ ] Real browser acceptance for new planner and earlier dashboard; physical screen-reader review.
- [ ] Genuine library install plus lockfile update for react-hook-form, @hookform/resolvers and @tanstack/react-query.
- [ ] Historic dev-only security exception review before 2026-12-02.

## Handoff

Read AGENTS.md, docs/checkpoint.json, docs/STUDY_PLANNER_ACCEPTANCE.md and docs/FORMS_QUERY_NEXT_MILESTONE.md. Do not treat older README milestones as the current state. Do not create unbounded PR stacks; keep coherent changes merged after available local qualification. Record any skipped gates.
