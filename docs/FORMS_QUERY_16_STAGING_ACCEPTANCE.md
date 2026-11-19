# Forms + Query — 16 Staged Lesson Packs Acceptance

**Date:** 2026-11-20
**Branch:** feat/forms-query-16-lesson-authoring-20261120
**Scope:** Staging content and local release tooling, not promotion to published lessons.

## Source delivered

- **16 distinct canonical lesson IDs**: all 8 React Hook Form topics in 09.02 and all 8 TanStack Query topics in 09.03.
- **16 substantive MDX draft articles** covering the learner problem, mental model, prediction, three guided implementation stages, common misconception, four-choice knowledge check, failure analysis, reflection, security boundary and two official references.
- **16 draft lab contracts** with intentionally broken starter TSX, corrected instructor TSX, explicit positive/negative acceptance scenarios, separate source files and nonpublishable status.
- **Two SSR-specific supporting files**: browser QueryClientProvider and client TaskList for staged 09.03.06. These do not create a hosted BFF.
- Staged 09.03.08 instructor integration source incorporates RHF/Zod, stable logical POST retries, filtered Query cache, conditional status PATCH and optimistic deletion rollback; this is source authored, NOT runtime qualified.
- Corrected the 09.02.05 instructor to use RHF rather than a standalone button-only fetch example.
- **16-topic source roadmap on the academy's existing noindex project page**, pointing directly to staged GitHub draft MDX. No `/learn/09.02.XX` pages are published.
- New Node-only `scripts/verify-forms-query-drafts.mjs`; TSX syntax-only `scripts/verify-forms-query-draft-types.mjs`; local source/full gate `scripts/qualify-forms-query.mjs`; curriculum coverage `scripts/curriculum-readiness.mjs`; package scripts and local offline gate updated.
- Quantified completion plan in `docs/CURRICULUM_FINISHING_ROADMAP.md` for the **551 still-unpublished canonical topics**. The 16 new drafts represent source staging, not 16 new published lessons.

## What was directly checked in this session

- **88/88** source/metadata consistency assertions on 09.02's 8 MDX + 8 metadata files, including canonical IDs/titles, prerequisites, source URLs and teaching structure.
- **88/88** equivalent assertions on 09.03's eight articles and metadata files.
- **48/48** staged lab manifest/source checks across all 16 packs. This caught one substantive defect in the async submission lesson and was rerun after correction.
- **4/4** new JS source verification scripts parsed as valid JavaScript in an isolated evaluator.
- Production published registry and MDX registry were inspected: none of the 16 staged IDs is imported as published; existing checkpoint remains 338 unique published lesson IDs / 337 MDX lesson files / 337 published lab fixtures.
- Staged official sources were compared to the canonical curriculum; two mismatched primary source references were corrected before the final checks.
- **Important precision:** These were GitHub-file-backed source assertions and JavaScript syntax parsing, **NOT** Node execution of the new repository scripts, TypeScript transpilation of all TSX staged examples, real RHF/TanStack package tests or a Next production build.

## Gates still NOT performed

1. Node 24 checkout, root `npm ci && npm run verify:offline`, running the new staged content validator and TSX syntax diagnostics against actual files.
2. Real npm-resolved compatible React Hook Form, Zod resolver and TanStack Query versions in nested React project, and an npm-generated nested lockfile.
3. **Actual** React TypeScript typechecking, browser DOM integration tests, positive instructor assertions and intentionally failing starter tests for all 16 topics, including SSR Next.js hydration.
4. The full existing 337 local labs, all negative-starter quality gates, lint, production Next build, responsive keyboard and screen-reader tests.
5. Real Node HTTP v3 tests on exact merged source and local Vite proxy/Host/Origin flow. PR #29 previously had 22 passing real HTTP tests on its older revision; this is not sufficient for latest code.
6. Review the dev-only security exception expiring 2026-12-02 UTC before a release.

## Local reproduction

From a complete project checkout:

```bash
node scripts/verify-forms-query-drafts.mjs
node scripts/curriculum-readiness.mjs --check
node scripts/qualify-forms-query.mjs --source

# After installing the existing trusted root dependencies:
npm run test:forms-query-draft-types

# On an actual Node 24 machine with trusted root + nested npm locks:
npm run qualify:forms-query:full
```

The full gate still explicitly reports **browser acceptance not executed**. Do not promote a staged MDX or lab manifest to `src/content/lessons/` or `labs/`, update publication counts, or present the work as a production-qualified lesson until all relevant package, typed assertion, UI and release checks pass.

## Next engineer

Read `AGENTS.md`, `drafts/forms-query/README.md`, `docs/CURRICULUM_FINISHING_ROADMAP.md`, `docs/NEXT_TODO.md`. Start by resolving real npm libraries and executing `npm run qualify:forms-query:source` in a normal local checkout, then install/lock nested packages, implement failing red-starter tests and qualify one eight-topic module at a time.
