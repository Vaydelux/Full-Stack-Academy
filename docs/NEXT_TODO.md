# Full-Stack Academy — Authoring and Release Handoff (2026-11-20)

## Exact state after Forms/Query 16-pack staging

- Source baseline: PRs #20–#30 merged. This milestone is staged on `feat/forms-query-16-lesson-authoring-20261120` and must not be mistaken for an already published React Hook Form/TanStack Query module.
- Canonical counts: **28 tracks, 111 modules, 889 topics, 338 unique published lessons, 337 MDX lessons and local published lab manifests, 42 complete modules**.
- **551 topics remain unpublished.** Sixteen now have individual MDX teaching drafts, staged metadata, broken starter source, instructor source and acceptance contracts outside the published registry. **535 topics still need source-level staging**.
- Completed staging: React Hook Form `09.02.01–09.02.08`; TanStack Query `09.03.01–09.03.08`.
- Live academy page `/learn/projects/forms-query` lists all 16 staged topics and links GitHub source; it is noindex and does not host the unauthenticated Task API.
- Existing loopback Task API and React reference client from PR #30 remain source examples. They still need latest-version real Node tests and a nested React package lock/typecheck/browser acceptance.
- No GitHub Actions or Vercel checks were used. No public demo server is authorized.

## Staged authoring delivered

- [x] 16 substantial canonical MDX draft articles, with three guided steps each, concept explanations, predictions, misconceptions, knowledge checks, bug hunts, reflection and official sources.
- [x] 16 per-topic red starter and instructor TSX pairs plus individual acceptance manifests.
- [x] Fix RHF async submission starter/solution so retry keeps one logical idempotency key and the form is actually managed by RHF.
- [x] Add missing Next SSR client/provider source assets to query hydration draft.
- [x] Expand the remote-task capstone instructor source to cover RHF, Query, invalidation, conditional status updates, request retry and rollback.
- [x] Verify primary official URLs and prerequisites against canonical curriculum; fix two source misalignments.
- [x] Source file checks: 88/88 per module article/metadata assertions, 48/48 lab contract assertions, 4/4 JS verification script syntax parses; no staged topic accidentally imported into published registries.
- [x] Add a Node-only staging validator, TSX syntax diagnostic script, strict source/full release runner and deterministic curriculum coverage report.
- [x] Expose new local scripts via package.json and verify:offline.
- [x] Add source directory README, large-scope roadmap and precise acceptance handoff.

## Unfinished release gates (DO NOT MARK DONE)

- [ ] Run actual Node 22/24 `npm run qualify:forms-query:source` on a full Git checkout, including the updated v3 real HTTP socket suites and the 16-pack staging validator.
- [ ] On Node 24, run root trusted `npm ci`, `npm run verify:offline` and staged TSX syntax verification. Fix all *actual* lint/typecheck/build issues.
- [ ] Resolve/install **real** RHF, Zod resolver and TanStack Query npm packages; commit npm-generated nested lockfile, then nested `npm ci`, typecheck/build.
- [ ] Create and execute real React DOM/keyboard/integration tests for 16 instructor solutions and intentional assertion-failing starters. Verify SSR hydration with a real Next boundary rather than a Vite-only approximation.
- [ ] Verify 320px/tablet/desktop, zoom/reduced-motion, focus management, labels/error announcements, request journal, 409/412 recovery and Vite proxy/Host/Origin compatibility in a real browser.
- [ ] Promote `09.02` and `09.03` one complete verified module at a time to `src/content/lessons/`, `labs/`, `lesson-registry.tsx`, `published.ts`, package scripts and checkpoint. **Do not merely copy files and mark authored.**
- [ ] Review historical dev-only dependency exception before **2026-12-02 UTC**.

## Next large curriculum batches after Forms/Query

1. **11.01–11.04 NestJS** (32 topics): locked DI, validation, auth pipeline and genuine HTTP tests.
2. **12.01–12.05 PostgreSQL** (40 topics): actual migrations, transactions, indexes, EXPLAIN and rollback.
3. **13–14 Prisma + Supabase** (64 topics): client generation, migrations, authentication and denial-first RLS tests.
4. Continue production/security/testing/deployment, specializations and capstones in dependency-respecting eight-topic modules. Inspect `npm run status:curriculum` after every merge rather than guessing counts.

## Start here

1. `AGENTS.md`
2. `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md`
3. `drafts/forms-query/README.md`
4. `docs/CURRICULUM_FINISHING_ROADMAP.md`
5. `examples/forms-query-vertical/README.md`
6. `docs/checkpoint.json`

Source-authored ≠ TypeScript-checked ≠ library-tested ≠ browser-qualified ≠ released. Retain this distinction in all future status reports.
