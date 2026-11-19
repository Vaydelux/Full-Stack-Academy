# Study planner — milestone acceptance and risk record

**Date:** 2026-11-19  
**Scope:** /learn/dashboard enhancement. No new published course IDs or framework dependencies.

## Implemented source

- Pure prerequisite-aware session planning: src/lib/academy/study-plan.ts
- Responsive client UI: src/components/course/StudyPlanPanel.tsx
- Reused existing published lesson registry, canonical curriculum prerequisites, existing local learner progress, and lesson deep links.
- Time budgets of 15/30/45/60/90 minutes; module focus, already-started priority, at most four suggested lessons, stretch-goal indicator, no eligible-lesson state, and missing prerequisite warning.
- No background jobs, accounts, network fetches, custom scheduling stores or automated marking complete.
- Offline command: npm run test:study-plan; included in scripts/verify-offline.mjs.

## Exact executable evidence

- **PASS:** 9/9 Node 22.16.0 tests using --experimental-strip-types for prerequisite order, begun lessons, cross-module dependencies, missing/cyclic dependencies, budget bounds, oversized lesson fallback, deduplicated catalog, completion and queue limits.
- **PASS:** strict TypeScript check of pure planner helper using locally available global TypeScript.
- Exact Git blob SHA for the core helper: a1a142aae758374e1124a549323cfd59076baa08; committed GitHub blob matches executed local source.
- Exact Git blob SHA for nine-case tests: 18fca03ba33bce9f3136fb73f4254768fc37a2cd; committed GitHub blob matches executed local test source.
- **PASS syntax only:** UI TSX checked by TypeScript's transpile diagnostics before a focused aria-live accessibility adjustment. A successful transpilation does not prove component type correctness.

## Unverified release gates

- Entire Next.js package install/typecheck/build, imported React component type resolution, 320px layout, real keyboard/focus, screen-reader announcement, actual learner progress import/export, and end-to-end browser navigation.
- Full-project Node 24 test suite and historical dev dependency advisory exception due 2026-12-02 UTC.
- No GitHub Actions or Vercel calls were used.

## Design boundaries

- Study queue is a *suggestion*, not a calendar booking, completion, grading, or saved schedule.
- Only published canonical lessons are eligible; a prerequisite missing from the published set is treated as blocked rather than silently ignored.
- A prerequisite scheduled earlier in the same queue may unlock its successor for display, but learner completion state is never mutated.
- Estimated times are intentionally rough. A first lesson longer than the selected budget is labeled a stretch goal.
- Use the existing progress store to honor the established self-assessed completion contract.

## Next deliverable

Real React Hook Form 09.02 and TanStack Query 09.03 course modules still require lockfile-resolved npm dependencies and executable React/browser acceptance. The local environment could not resolve the npm registry or GitHub clone network endpoints; no fake integrations or guessed lockfile hashes were committed. See docs/FORMS_QUERY_NEXT_MILESTONE.md.
