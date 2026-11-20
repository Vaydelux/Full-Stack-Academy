> **Phase P1 editorial checkpoint (2026-11-20):** Eight 09.02 RHF drafts received individualized decision guides and regressions, without changing their red/green TSX examples. Run `npm run test:forms-query-rhf-editorial` plus all release gates on a Node24 checkout. **No lessons published in this milestone**; count remains 338/889. Details: `docs/P1_RHF_EDITORIAL_ACCEPTANCE.md`.

# Publication-first master priority — 2026-11-20

Finish the **889 existing canonical topics**, one verified module at a time, **before expanding the academy**. New source-derived seven-phase plan and acceptance gates: `docs/ACADEMY_889_PUBLICATION_PROGRAM.md`.

- Current: **338 published, 551 unpublished**, 16 Forms/Query drafts staged, 535 topics not drafted, **69 incomplete modules**.
- **P1 active:** 09.02 React Hook Form (8) then 09.03 TanStack Query (8); target 354. **PR #36 is unmerged** until actual full Next MDX/browser acceptance, so do not present the preview as released.
- **P2–P7:** NestJS, PostgreSQL, Prisma/Supabase, security/caching/realtime/integrations, quality/operations/architecture, mobile/enterprise/capstones. Targets are **386, 426, 490, 609, 753, 889**.
- The special lesson **15.02.04 is already published** as an interactive article. Phase P5 has 119 remaining topics, not 120.
- Local source commands: `npm run status:publication-phases`, `node scripts/curriculum-phase-program.mjs --phase P1 --json`, `npm run test:publication-phases`.
- Before any module is called published: runnable positive+negative lab tests, locked runtime dependencies, metadata and both registries, full Node24 Next build, browser/keyboard and named screen-reader/200% zoom review. No fake green results and no GitHub Actions/Vercel.

---

# Full-Stack Academy — Current Engineering Handoff (2026-11-20)

## Latest mainline reviewed

- **Latest observed main before this feature:** `ec518b41cdb08003580a865a213311d1660dfd9f`, merge of `fix/local-release-qualification` at 2026-11-20 07:12 UTC. This is **four commits ahead of PR #34**, with new Node24/local React, Vite, browser and SSR qualification, source repairs and nested npm lock.
- That merged checkpoint reports Node **24.22.3** root `verify:offline`/Next build, 130 Forms/Query cases, 15 native Chrome checks, seven React workflow cases, all 16 positive instructor and negative starter cases, isolated SSR hydration, and the full locked `qualify:forms-query:full`. **Those are reported prior local results; the present environment cannot rerun the full Node24/browser pipeline.**
- **Canonical curriculum:** 28 tracks, 111 modules, 889 topics. **338 published unique lessons / 337 MDX and published lab manifests / 42 complete modules**; 551 topics not published, with 16 09.02/09.03 lesson packs staged, 535 not yet staged.

## New larger-scope publication-preflight milestone

- [x] Inspected all changes introduced after PR #34. Corrected one release-hygiene defect: **three generated Vite `react-client/dist/` assets were tracked in Git despite an existing ignore rule**. They have been removed from version control; the genuine nested React `package-lock.json` remains committed.
- [x] Added `scripts/forms-query-promotion-readiness.mjs`, a read-only fail-closed inspection of all 16 canonical staged topics: catalog identity, lesson/module IDs, primary official URLs, rubric, MDX/code-source parity, intentional red/green fixtures, browser scenario presence, and incomplete publication across the two registries and canonical lab paths.
- [x] Gate supports `--check` for structural consistency, `--json` for future agent handoff, and `--strict` to reject a purported publication without human accessibility evidence, correct published dependencies/stack pins, canonical lab/MDX files and both registries. **Strict is expected to reject the current staged modules.**
- [x] Added nine publication-readiness regression assertions, four build-artifact/lockfile hygiene tests, and `npm run status:forms-query-promotion` / `npm run test:forms-query-promotion` scripts; registered these in `verify:offline` and Forms/Query `--source` qualification.
- [x] Documented a module-by-module atomic publication integration and a reviewer-authored accessibility-evidence schema in `docs/FORMS_QUERY_PUBLICATION_READINESS.md`. The script does not fabricate manual checks or publish lessons.
- [ ] Run the new Node tests on a complete local checkout with npm available; the model's local Node22 shell cannot resolve GitHub/npm DNS, so the latest root Node24/Next build, browser and the new complete-checkout script have **not** run in this environment.

## Priority work remaining

1. Run `npm run test:forms-query-promotion` and `npm run qualify:forms-query:source` on the full Node24 checkout. Fix structural failures if any. Check Git's staged/committed diff has no generated `dist/`.
2. **Human accessibility review for all 16 exercises**: keyboard-only flow, error/status announcements using a named screen reader, focus after mutations, 200% zoom at 320px/tablet/desktop and reduced-motion. Store true reviewer evidence only after hands-on testing, per the documented JSON schema.
3. **Publish 09.02 (8 React Hook Form lessons) first** with root RHF/resolver deps and trusted npm-generated lock; strict MDX metadata, 8 real executable lab manifests/positive and negative tests, LessonArticle and MDX_METADATA imports, and reconcile the staging validators. Run all root/full/browser gates on that exact publication commit.
4. **Publish 09.03 (8 TanStack Query lessons)** only after 09.02 is green. Add TanStack Query root runtime, query-key/isolation/cursor/optimistic rollback tests, and repeat publication gates. Target when both pass: **354 published unique lessons, 353 MDX/labs, 44 completed modules**; current totals remain **338/337/42**.
5. Then build NestJS (32), PostgreSQL (40), Prisma and Supabase (64) lesson batches using actual backend runtimes and trustworthy tests, not source-only completion claims.
6. Review the existing dev-only security exception before **2026-12-02 UTC**.

## Commands and durable references

```bash
npm run status:forms-query-promotion
npm run test:forms-query-promotion
npm run qualify:forms-query:source
npm run qualify:forms-query:full
```

`docs/FORMS_QUERY_PUBLICATION_READINESS.md` — module publication steps/evidence; `docs/FORMS_QUERY_REAL_NODE_ACCEPTANCE.md` — prior 102 real Node tests; `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md` — originally staged sources; `docs/CURRICULUM_FINISHING_ROADMAP.md` — full 889-topic roadmap; `AGENTS.md` — contributor guidance; `docs/checkpoint.json` — published source counts.

**Guardrails:** No GitHub Actions, no Vercel checks, no fake npm lock integrity, no unqualified lesson publication. Distinguish historical reported checks from rerun results on a new candidate.
