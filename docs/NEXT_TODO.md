> **P1 release handoff:** See `docs/P1_QUERY_PROMOTION_CANDIDATE.md` for the eight TanStack Query packages, source-parity evidence, SSR port fix, complete local commands, human review SHA requirements and strict RHF-first publication order (338→346→354). PR #38 is draft; no runtime/human release gates have been executed here.

> **P1 scope expansion checkpoint (2026-11-20):** Both eight-topic modules now have honest source-only candidate packages: RHF 09.02 and Query 09.03. All 8 Query projected MDX articles were executed through the publication text converter in V8 and preserved TSX and guided-step structure; a Git blob audit verified all 16 Query red/green source copies exactly match staged source. A guarded Query 54-file publisher refuses to run until RHF 09.02 is live, and requires genuine npm/Chromium/Next SSR and human accessibility evidence. The source qualification and `node --check` gates now include both modules. No hosted CI, no actual Node24/npm/browser or named screen-reader tests performed; **338/889 remains the actual published count**.

> **Published MDX source fix:** The previous RHF promoter left draft-only claims in eight otherwise published lessons. Added a fail-closed published-article transformer and source suite to make publication instructions accurate without modifying original draft code or inventing review evidence. Published count still 338/889.

> **RHF check/review integrity hardening (2026-11-20):** PR #38 now has one stable reviewed-content SHA-256 shared by the readiness audit and publication command. In-memory mutation tests detect edited lesson or instructor code, while excluding generated registry-only changes. Guarded apply rechecks review SHA and clean worktree after all slow tests, before writing lessons. This is authored source protection; Node24/npm/Chromium and physical screen-reader evidence remain unexecuted, so the publication total stays 338.

> **RHF accessibility consistency fix (2026-11-20):** Centralized the reviewed-source SHA-256 in `scripts/forms-query-review-fingerprint.mjs`. Both the promotion command and the general Forms/Query readiness audit now require the same current source SHA for RHF human evidence. Excluded the two automatically regenerated live registries from the hash so publication itself cannot invalidate an otherwise truthful review. No approval invented; 338 lessons remain live.

> **RHF exact-source reviewer protection (2026-11-20):** A read-only `--plan` now prints a SHA-256 fingerprint for all eight release candidates and their teaching/UI/test boundaries. The guarded `--apply` refuses accessibility evidence that references an earlier version. A separate example JSON is deliberately unapproved. All 36 changed JS files pass nonexecuting V8 syntax parsing after a real audit-CLI syntax defect was corrected, and the permanent Node `test:js-syntax` release gate covers 101 source files. Actual browser and human accessibility qualification remains unexecuted; 338 published.

> **Validated blocker fixed (2026-11-20):** The RHF candidate CLI had an actual JavaScript syntax error in its `--check`/`--strict` exit-code condition (mismatched parentheses). Reproduced with local Node 22 `node --check`; corrected and added a direct `--check` subprocess regression to the source suite. The publication rehearsal and candidate manifest projection remain source-only until the full Node 24 checkout and browser gates run.

> **Candidate metadata correction (2026-11-20):** Audited all eight proposed published metadata objects against the content validator, and removed outdated root RHF package-lock blockers. Eight candidates now accurately require locked nested React execution, real Next published build, browser red/green tests and truthful accessibility evidence. The in-memory `--simulate` release generator is authored but has not run here; no live lessons were published.

> **Latest release mechanism (2026-11-20):** `npm run promote:forms-query:rhf -- --plan` displays the current eight-topic release map without writes. A guarded `--apply` command now prepares the actual live lessons/labs, both registries and checkpoint only after real Node24/Chromium acceptance and named human accessibility evidence, then reruns the post-promotion offline/browser suites with rollback on failure. All changes are still on draft PR #38; published total remains 338. No full browser or a11y run was performed here.

> **Publication architecture correction (2026-11-20):** React Hook Form 7 / `@hookform/resolvers` and TanStack Query 5 run only inside the independently locked React/Vite lab, not the Next academy's production runtime. Root dependency additions were an unnecessary blocker. The release checker now verifies the nested npm lock and `content/stack-versions.json` pins (RHF 7/Query 5), while retaining mandatory real npm/Chromium/manual a11y gates. **338 lessons remain published.**

> **P1 09.02 promotion preparation (2026-11-20):** Eight complete *source* release bundles now exist outside the published registry with MDX, draft-to-live metadata projections, red/green lab sources and authored browser-backed test files. A dedicated dynamic-port RHF browser gate and strict candidate audit have been added. Runtime/browser/manual acceptance has not executed, so published count remains 338. [RHF release handoff](P1_RHF_PROMOTION_CANDIDATE.md).

> **P1 publication candidate preflight (2026-11-20):** Eight 09.02 RHF lessons now have non-live publication-format MDX/metadata and matching red/green lab candidate bundles in `release-candidates/forms-query/09.02/`. Run `npm run status:forms-query-rhf-candidates` and `npm run test:forms-query-rhf-candidates`; `--strict` deliberately fails until release criteria are met. Fixed canonical short-title mismatch (e.g. “Zod resolvers”) in publication validator without permitting invented short titles. Real published count remains 338.

> **P1 RHF executable gate (2026-11-20):** Added a dedicated real Chromium/React Hook Form acceptance launcher with eight individually selectable lessons: `npm run qualify:forms-query:rhf-browser` or `npm run lab:forms-query-<slug>`. Commands require the genuinely locked nested React install and Playwright; **not executed here**. The eight MDX+metadata and lab publication candidates remain outside live registries, awaiting full runtime and manual a11y gates.

> **P1 candidate consolidation — 2026-11-20:** PR #38 now contains all 16 individualized RHF/Query lesson guides and the noindex reading preview previously proposed in PR #36. Added `test:forms-query-p1-content`, `test:forms-query-draft-preview`, `status:forms-query-p1`, and real Playwright preview command. The candidate has not passed a full Node24/Next/browser/manual a11y run and is **not published**. Published snapshot remains **338/889**. Use `docs/P1_CONTENT_PREVIEW_ACCEPTANCE.md` for exact handoff. Do not merge PR #38 until gates are verified.

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
3. **Publish 09.02 (8 React Hook Form lessons) first** with genuine nested RHF/resolver deps and their trusted npm-generated lock; strict MDX metadata, 8 real executable lab manifests/positive and negative tests, LessonArticle and MDX_METADATA imports, and reconcile the staging validators. Run all root/full/browser gates on that exact publication commit.
4. **Publish 09.03 (8 TanStack Query lessons)** only after 09.02 is green. Use the locked nested TanStack Query runtime, query-key/isolation/cursor/optimistic rollback tests, and repeat publication gates. Target when both pass: **354 published unique lessons, 353 MDX/labs, 44 completed modules**; current totals remain **338/337/42**.
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
