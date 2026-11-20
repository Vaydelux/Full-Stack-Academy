# Forms/Query: 16 On-Site Draft Lesson Previews

**Branch:** `feat/forms-query-readable-draft-preview-20261120`  
**Baseline:** merged PR #35 (`7893779b14a995310ca25a1826c790fad642d4a8`)  
**Date:** 2026-11-20

## Product improvement

The academy's Reliable Task Workflow project previously linked its sixteen staged React Hook Form and TanStack Query articles to raw GitHub MDX source. A learner could not review them within the same documentation shell and lesson navigation.

This milestone adds **16 no-index, explicitly staged reading pages**, one for each `09.02.01`–`09.02.08` and `09.03.01`–`09.03.08`:

```text
/learn/projects/forms-query/drafts/09.02.01
...
/learn/projects/forms-query/drafts/09.03.08
```

- Static whitelist registry `src/content/forms-query-draft-registry.tsx`, importing precisely the sixteen source MDX files. The published `src/content/lesson-registry.tsx` and `src/lib/academy/published.ts` are deliberately untouched.
- New `src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx` route with `generateStaticParams`, `dynamicParams = false`, whitelist checks, not-found handling, metadata `robots.index = false` and `robots.follow = false`.
- Breadcrumbs, published project context, prominent warning, official source link, a responsive reading layout, and previous/next draft navigation.
- Existing project roadmap now links to the in-app reading views and preserves a separate raw-source link.
- The previews **do not run the TypeScript exercise source in the hosted page**. Learners still run the already qualified RHF/Query starter and instructor exercises in the local locked Vite workspace.

## Published progress is isolated

The existing `KnowledgeCheck` component ordinarily records correct answers in the local course-progress store when given `lessonId`. All staged MDX articles include their own lesson IDs in quizzes, so simply reusing the component would have incorrectly marked unpublished lessons as passed.

Added client-only `DraftLessonScope` context, opt-in around the preview article only. Within that scope:

- The same knowledge-check UI still allows answering, checking, explanations and retry.
- A correct response **never calls `markQuizPassed`**.
- The visible footnote clearly states that preview answers do not save completion.
- Existing published lessons outside that context retain their previous progress behavior.

The draft preview does **not** add `LessonNotebook`, `LocalLessonCompletion`, published lesson IDs, module completion credit, or a live lab gate.

## Content qualification wording repaired

The 16 draft MDX articles still contained stale statements claiming no npm dependency lock or real Chrome test had ever been run. The latest branch merged from `fix/local-release-qualification` reported a genuine nested lockfile, Node 24/React/Chrome/SSR testing and 16 red/instructor variant behavior checks. All sixteen MDX status statements now acknowledge that **historical reported source qualification**, while explicitly preserving the independent publication and human accessibility blockers.

No learner article's TSX code fences, instructor code, red starter, quiz question, or official reference was changed.

## Evidence in this session

- Reviewed all **16** draft MDX files on the feature branch: top-level imports only the two existing trusted lesson UI modules; exact canonical quiz ID exists; no `<LabGate>`, embedded `<script>`, `<iframe>`, or detected dangerous DOM injection.
- Verified 16 explicit MDX registry imports, all sixteen map entries, no presence of those IDs in the published registries, whitelist routing, noindex metadata, and client preview context protection.
- New `tests/forms-query-draft-preview.test.mjs` contains **ten** Node source integrity cases; registered with `npm run test:forms-query-draft-preview`, root `verify:offline`, and Forms/Query source qualification.
- The 16 MDX content checks and registry/route/progress assertions were evaluated directly against connected GitHub file contents and passed. The exact new **Node test command was not run on a complete checkout**, nor was a Next production build, browser render, keyboard/screen-reader audit or deploy.
- No root/nested package dependency changes; no GitHub Actions or Vercel checks.

## New real browser acceptance gate (authored, not executed here)

This milestone additionally introduces `scripts/forms-query-draft-preview-smoke.mjs` and a targeted Playwright runner. The existing production academy smoke now invokes it automatically, so `npm run qualify:forms-query:full` checks the preview pages when run in a compatible local environment.

```bash
# Requires installed root Next dependencies, a successful local production
# build, and ACADEMY_BROWSER_ROOT with the isolated local Playwright package.
npm run qualify:forms-query:preview-browser
```

This gate checks all **16** preview URLs and project links, HTTP 200, noindex metadata, the expected lesson headings, responsive 320/768px overflow, previous/next links, invalid IDs returning HTTP 404, and safe quiz persistence. The production smoke runs it in a **separate ephemeral Playwright browser context**, keeping the deliberate published-quiz write from contaminating other tests. It submits an actual correct draft quiz and checks the browser's `fullstack-academy-v1` storage does **not** record credit, including after reload. It then answers a published 09.04.01 knowledge check and asserts the **published** lesson still gets saved.

The new source contract has **ten** Node test cases (previously nine), including assertions that the Playwright runner is registered. **Neither the ten Node cases nor the new Playwright gate has executed in this environment.** The root Node24/Next build and actual assistive-technology review remain mandatory.

## Next qualification / publication work

On the full repository checkout with Node 24 and real root npm dependencies:

```bash
npm run test:forms-query-draft-preview
npm run test:forms-query-promotion
npm run qualify:forms-query:source
npm run verify:offline
npm run qualify:forms-query:full
```

Inspect actual MDX page rendering and contrast at 320px/tablet/desktop and 200% zoom. Verify draft quiz selections do not update the learning-progress store or local persistence, including reload, and that the published quiz still does. Run the named assistive-technology and keyboard assessments documented in `docs/FORMS_QUERY_PUBLICATION_READINESS.md`.

Only after candidate-level builds, executable published lab manifests, root RHF/Query dependencies, metadata conversion, both published registries, and reviewer assessment should the project promote eight lessons at a time. Source of truth remains **338 published unique IDs, 337 MDX/lab manifests, 42 complete modules, 16 staged/unpublished topics**.

**Risk:** These sixteen MDX sources were exercised as draft source and TSX fixtures but have **not** been directly compiled as Next.js page imports in this environment. A true Next build is a mandatory follow-up. Do not label this preview route release-qualified until it passes.
