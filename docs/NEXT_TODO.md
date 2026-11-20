# Full-Stack Academy — Engineering Handoff (2026-11-20)

## Current target and release boundary

- **Base:** PR #35 merged on main at `7893779b14a995310ca25a1826c790fad642d4a8`. Current feature `feat/forms-query-readable-draft-preview-20261120` adds safely navigable in-academy staged reading pages.
- **Published curriculum remains:** 28 tracks, 111 modules, 889 canonical topics, **338 unique published lessons, 337 authored MDX and live lab manifests, 42 completed modules**. 16 RHF/Query topics are draft-staged and preview-only, **not published**; 535 more topics are unstaged.
- Baseline Windows Node 24.22.3 local qualification **reported** root offline/Next build, 130 Forms/Query Node cases, 15 native Chrome checks, seven React-workspace flows, all sixteen staged instructor + negative-starter Chrome behavior checks and isolated SSR hydration. The newly imported MDX preview route was **not part of that build**.
- No GitHub Actions, Vercel checks, fake npm locks or production deployments in this workflow.

## Milestone now implemented

- [x] Add **16 explicit noindex MDX reading routes** `/learn/projects/forms-query/drafts/<lessonId>`, with static allowlisted IDs, canonical lesson titles, source links and previous/next sequence.
- [x] Make the Forms/Query project page link each staged topic to a readable academy page rather than only a raw GitHub MDX source, preserving the raw-source option.
- [x] Add a scoped client-only `DraftLessonScope` around preview article content; the shared KnowledgeCheck renders quiz practice but **never calls markQuizPassed in draft preview**. Published lessons outside this scope still save locally as before.
- [x] Update all 16 staged MDX articles to remove obsolete claims that no locked React dependencies/Chrome tests exist. Their code fences and test fixtures remain unchanged. The newer text acknowledges historical reported qualification but says that publication and human accessibility checks remain outstanding.
- [x] Add `tests/forms-query-draft-preview.test.mjs` (9 authored Node cases), add the npm test command, integrate it into `verify:offline` and Forms/Query source qualification.
- [x] Direct GitHub-source review: all sixteen MDX files have the expected trusted imports, correct KnowledgeCheck lesson ID, no LabGate or embedded script/iframe, no stale qualification phrase. Static mapping/route/quiz-source assertions passed.
- [ ] **Actual Node execution of the new test file and Next MDX production build** on a full installed checkout; this current runtime cannot resolve GitHub/npm DNS and cannot execute a fresh React/Next application.

## Immediate P0 on a full Node 24 checkout

```bash
npm ci
npm run test:forms-query-draft-preview
npm run test:forms-query-promotion
npm run verify:offline
npm run qualify:forms-query:full
```

Open all 16 preview URLs locally; inspect MDX compilation, keyboard focus, 320px–desktop/200% zoom wrapping, quiz announcements, noindex header, and previous/next links. Verify a correct quiz in a preview does not mutate persisted course progress while an existing **published** quiz still does. Record real browser/a11y evidence, fix failures before release.

## P1: Integrate fully qualified canonical RHF/Query modules

1. Obtain human keyboard + named screen reader + 200% zoom review for each of the 16 exercises. Do not invent reviewer evidence; see `docs/FORMS_QUERY_PUBLICATION_READINESS.md`.
2. Package 09.02 as eight canonical `src/content/lessons/*.mdx` + strict `*.meta.json` + runnable `labs/forms-query-*/` manifests with positive/negative tests; integrate both published registries, real root RHF/resolver deps and a trustworthy npm-generated root lock.
3. Reconcile `verify-forms-query-drafts.mjs` with promotions so module publishing cannot silently diverge from the staged verified source. Run the complete offline and browser qualification against the exact candidate. **Only then** move 338 → 346 published, 337 → 345 MDX/labs, 42 → 43 complete modules.
4. Repeat for 09.03 TanStack Query with real root Query dep, conditional retry/optimistic rollback and Next SSR behavior. **Only after verified publication**, move counts to 354/353/44.
5. Continue NestJS 11, PostgreSQL 12, Prisma 13 and Supabase 14 as actual runtime-tested course units. Review the dev-only security exception before **2026-12-02 UTC**.

## Required references

`AGENTS.md`, `docs/FORMS_QUERY_DRAFT_PREVIEW_ACCEPTANCE.md`, `docs/FORMS_QUERY_PUBLICATION_READINESS.md`, `docs/FORMS_QUERY_REAL_NODE_ACCEPTANCE.md`, `drafts/forms-query/README.md`, `docs/checkpoint.json`.

**Noindex readable preview ≠ published lesson; source assertion ≠ real Next compile; staged browser demo check ≠ human assistive-technology approval.**
