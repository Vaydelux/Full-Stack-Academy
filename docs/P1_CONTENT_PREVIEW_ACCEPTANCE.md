> **P1 09.02 promotion preparation (2026-11-20):** Eight complete *source* release bundles now exist outside the published registry with MDX, draft-to-live metadata projections, red/green lab sources and authored browser-backed test files. A dedicated dynamic-port RHF browser gate and strict candidate audit have been added. Runtime/browser/manual acceptance has not executed, so published count remains 338. [RHF release handoff](P1_RHF_PROMOTION_CANDIDATE.md).

# P1 content and preview candidate — acceptance handoff

**Date:** 2026-11-20  
**Candidate branch:** `feat/p1-rhf-eight-lesson-depth-20261120` / PR #38

## Actual changes in this candidate

- 09.02.01–09.02.08: eight original React Hook Form guides strengthened with state ownership, controllers, Zod transforms, field arrays, idempotent submission, reset/dirty state, server focus recovery and derived values.
- 09.03.01–09.03.08: eight TanStack Query guides strengthened with cache keys, freshness/garbage collection, invalidation, rollback/concurrency, cursor pagination, SSR hydration, cancellation/retries and task-workflow integration.
- All sixteen staged articles preserve their original exactly paired TSX learner-starter/instructor examples and are not added to live published lesson registries.
- Reads all sixteen trusted MDX drafts through a **noindex preview route** with previous/next navigation and a separate MDX registry. Draft quizzes remain local practice and must not grant live lesson progress.
- Preview Playwright smoke authored for 16 URLs, mobile and tablet width, metadata, unknown 404 routes, draft quiz suppression and a positive published quiz control.
- New source tests and a read-only P1 JSON status command; scripts join the existing offline and Forms/Query source check flow.

## Verification scope: do not overstate

**Source checks in this candidate** inspect structural invariants but cannot replace running the Node24/Next/Chrome suites. There is no verified local Next build or actual browser outcome for the consolidated branch in this environment. Previously logged Node24/browser results are historical and may not validate these newly combined MDX page imports. Human keyboard-only, 200% zoom and named screen-reader review remains unrecorded. No GitHub Actions/Vercel evidence substitutes for these.

## Local release commands (Node24, full repository checkout)

```bash
npm ci
npm run test:forms-query-p1-content
npm run test:forms-query-draft-preview
npm run test:forms-query-drafts
npm run test:forms-query-promotion
npm run test:publication-phases
npm run verify:offline
npm run qualify:forms-query:preview-browser
npm run qualify:forms-query:full
npm run status:forms-query-p1
```

An external Playwright installation and Chromium executable are required by the existing academy browser harness. Check an actual 320px, 768px and desktop rendering, 200% zoom and named screen-reader feedback. Record reviewer evidence honestly under the existing module release-evidence schema.

## P1 release order

1. Qualify candidate preview and existing 16 staged positive/negative practice apps.
2. Publish **only 09.02** atomically with eight canonical MDX+metadata entries, eight real lab manifests with executable and negative tests, independently locked React teaching runtime, both registries and released accessibility evidence. *Target* 346 published, 43 complete modules; current count is 338/42.
3. Qualify and publish **09.03** in a separate module release unit, target 354 published, 44 complete modules.
4. Proceed to P2 NestJS 32 topics in eight-topic modules after P1 is genuinely finished. No new product expansion before the existing 889 canonical topics are complete.

## PR overlap

Original PR #36 proposed the preview independently against an older base and was unmergeable. PR #38 now contains the preview source as well as both topic guides; avoid merging both branches independently without verifying their overlap. Do not treat this consolidation as a release approval.

### Expanded responsive preview regression (authored; no browser executed)

The Playwright preview smoke now checks every unpublished lesson at two portrait/landscape-or-tablet sizes, and each module's opening lesson across seven widths and orientations: 320×780, 375×812, 414×896, 768×1024, 812×375 landscape, 1024×768 and 1440×900. For each visit it checks reachable routes, noindex metadata, visible lesson headings, preview-only progress messaging and both document/body scroll overflow. This adds automated layout coverage but cannot replace physical keyboard, 200% zoom or named screen-reader review.

### Coverage preserved after RHF/Query publication

The same production Playwright browser gate now also discovers all **published** P1 lesson IDs from the real metadata files and revisits their `/learn/{lessonId}` routes. It checks the published guided article and narrow/landscape layout for every promoted topic, and seven viewport sizes on each published module's first lesson. Therefore source-to-live promotion cannot silently remove the topics from responsive acceptance. This adds automated route/layout coverage only; no Chromium run, 200% zoom, keyboard or human screen-reader review has yet been performed for the candidate branch.
