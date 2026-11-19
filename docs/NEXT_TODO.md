# Full-Stack Academy — Current handoff (2026-11-19)

## Actual source state

- **PRs #20–#27 have merged into main.** Six curriculum layers, learner dashboard and budgeted/prerequisite-aware study planner are present in source.
- Latest large integrated learning workflow: bookmarkable published lessons, private in-article notes, saved library on the dashboard, searchable/paginated published catalog, cross-tab progress/theme refresh and explicit storage failure messaging.
- The curriculum snapshot stays **338 distinct published lessons, 337 MDX articles and local lab manifests, 42 complete modules, 38 authored reference drafts, 303 indexed reference subjects**, with 551 planned of 889 canonical topics. This milestone is UX and local persistence, **not 16 new published lessons**.
- Source is NOT a validated production release. GitHub clone and npm registry DNS could not resolve in the local runtime, so full Node 24 checkout/Next build/Chromium checks could not run. No GitHub Actions or Vercel checks were used.

## What has been delivered in this larger scope

- [x] Backward-compatible bookmarks field in Zod v1 progress backup and published-ID allowlist on restore
- [x] Bookmark toggle, in-article private notes, explicit Save, unsaved-edit protection and storage failure feedback
- [x] Saved-work dashboard shelf with search, filters, lesson links and bounded rendering
- [x] Progressive published lesson explorer replacing a 338-card initial accordion; ID, topic, module and level search
- [x] Same-origin storage-event sync, global theme application and storage-access-denied guard
- [x] Interactive workspace notes now warn about failed local saving
- [x] Study-session queue prioritizes started lessons then eligible bookmarks without breaking prerequisites
- [x] Add discovery and learning-workflow tests to npm offline quality scripts
- [x] Isolated exact-source checks: 14/14 discovery behavior, 11/11 study-plan behavior, 7/7 structural wiring checks passed
- [x] No new runtime dependencies, secrets, remote code execution, or authored lesson IDs

## Next cohesive milestones (not yet implemented)

1. **P0 — Release qualification:** use full Node 24 checkout; npm ci && npm run verify:offline; browser smoke at 320/768/desktop, keyboard/scroll/focus, screen reader, theme toggle, mobile catalog, note export/restore, legacy v1 backup, browser storage unavailable, two-tab conflict. Fix any actual failures. Historical dev-only Picomatch exception expires **2026-12-02 UTC**.
2. **P1 — Forms + remote state, 09.02/09.03 (16 topics):** genuinely install and lock react-hook-form, @hookform/resolvers and @tanstack/react-query with compatible versions; implement full canonical lesson/metadata/negative-starter/instructor/lab bundles and real form-to-local-HTTP query/cache capstone. Keep PLANNED until actual dependencies/build/tests pass. Detailed draft: docs/FORMS_QUERY_NEXT_MILESTONE.md.
3. **P2 — NestJS (32 topics):** real DI/validation/pipeline/auth and local HTTP fixtures with locked compatible Nest packages, testable instruction.
4. **P3 — PostgreSQL (40 topics):** genuine DB environment, SQL migrations and rollback, concurrency/recovery tests; no simulated database presented as actual.
5. **P4 — Prisma + Supabase (64 topics):** real clients, migrations, Auth/RLS-denial and audit boundaries, testable locally and in isolated free-tier cloud fixtures where appropriate.

## Evidence gaps / risks

- [ ] Full Node 24 npm ci, lint/typecheck, Next build and 337+ lab tests
- [ ] Real Chromium keyboard/mobile/a11y and UI data persistence tests (isolated JS selectors != app acceptance)
- [ ] Cross-tab edits use last-write-wins; concurrent changes may conflict
- [ ] Browser localStorage is not durable authenticated cloud sync; backup files include learner-authored notes and should be private
- [ ] Verify older Zod v1 backup without bookmarks imports safely
- [ ] Make dependency registry accessible and resolve exact RHF/TanStack packages; do not hand-edit npm integrity or fabricate lockfiles
- [ ] Review dev-only Picomatch advisory exception due 2026-12-02 UTC

## Where the next engineer starts

Read AGENTS.md, docs/LEARNING_WORKFLOW_V2_ACCEPTANCE.md, docs/FORMS_QUERY_NEXT_MILESTONE.md, docs/checkpoint.json. Prioritize **verified local quality and the real two-module form/query implementation** rather than stacking more UX-only PRs. Keep the published registry and unique count exact; make source authored and production validated separate statuses.
