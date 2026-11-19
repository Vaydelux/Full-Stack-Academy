# Full-Stack Academy — active development handoff (2026-11-19)

## Current source state

- **PRs #20, #21, #22, #23, #24 and #25 have all been merged into main**, in dependency order with normal merge commits. Last merge SHA: e64bacc33abd0bf6d5f1b50c6559af9321ef01de.
- **Latest source-only milestone:** learner dashboard at /learn/dashboard (see docs/LEARNER_DASHBOARD_ACCEPTANCE.md), currently prepared on feat/learner-dashboard-progress-20261119 for a new PR and same-turn merge.
- The six curriculum merges contain a *source candidate* of 338 unique published lesson IDs, 337 MDX articles, 337 lab manifests, 42 full modules, 38 authored references of 303 indexed, with 551 of 889 catalog topics still planned.
- Full Track 10 covers 32 source-authored Node.js, HTTP, Security and OpenAPI lessons; demonstrations are teaching fixtures, **not** deployable public security architecture.
- No GitHub Actions or Vercel verification was used. No full project Node 24 npm install, Next build/typecheck or Chromium acceptance occurred in this execution. **Main is not release-qualified by the merge alone.**

## Completed in this continuation

- [x] Merge PR #20 Next.js source
- [x] Merge PR #21 UI systems
- [x] Merge PR #22 Zod 4
- [x] Merge PR #23 Zustand 5
- [x] Merge PR #24 Node/HTTP
- [x] Merge PR #25 security/OpenAPI
- [x] Build learner dashboard pure read-model, route, navigation, module filters and progress/backup UI
- [x] Harden import path to report browser storage write failures accurately
- [x] Add pure model tests and wire into offline verification script
- [x] Preserve published lesson counts; dashboard is an app route, not an authored lesson

## Next cohesive large development blocks

1. **Release qualification and UI acceptance:** full Node 24 checkout, npm ci, npm run verify:offline, local Chromium keyboard/mobile/screen reader; review the Picomatch dev advisory exception by 2026-12-02 UTC. Fix actual failures. No hosted/Actions checking required.
2. **Forms and async server state (09.02 and 09.03, 16 canonical topics):** install/lock actual react-hook-form, @hookform/resolvers and @tanstack/react-query; implement a coherent form-to-API-to-cache vertical slice, instructor/red labs, optimistic rollback, abort/cancellation, validation and browser tests. These lessons remain **PLANNED** until packages and runnable tests exist.
3. **NestJS Track 11 (32 topics):** real compatible locked NestJS packages, pipeline/DI/DTO/service/auth examples, isolated HTTP integration tests.
4. **PostgreSQL Track 12 (40 topics):** actual ephemeral DB test harness, transactions, indexes, EXPLAIN, migration and rollback.
5. **Prisma/Supabase Tracks 13–14 (64 topics):** generated real clients, migration/recovery and RLS denial tests, never a fake auth simulation presented as secure.
6. **UX expansion:** resume/bookmarks/notes usability, calmer curriculum module browser, reference search, responsive/keyboard improvements with evidence.

## Outstanding verification, not claims of success

- [ ] npm ci && npm run verify:offline on exact merged SHA, Node 24
- [ ] npm run test:learning-dashboard (pure TS helper tests)
- [ ] Local browser smoke for dashboard empty/in-progress/completed paths and 2 MB backup rejection
- [ ] Multi-tab, localStorage disabled/quota exceeded, keyboard, 320px, reduced-motion, screen-reader navigation
- [ ] Full lessons and lab tests from previous six PRs
- [ ] Historical exception review due 2026-12-02 UTC

**Source truth:** AGENTS.md, docs/checkpoint.json, docs/PROJECT_CHECKPOINT.md, docs/LEARNER_DASHBOARD_ACCEPTANCE.md. Do not add another tower of stacked drafts; merge coherent qualified slices, and distinguish source completion from executable evidence.
