> **On-site preview milestone (2026-11-20):** The academy project page links to 16 staged MDX reading pages under `/learn/projects/forms-query/drafts/09.02.01` through `/learn/projects/forms-query/drafts/09.03.08`. They use the existing lesson components, show a prominent unpublished warning, and prevent practice quiz answers from granting published course progress. Pages are noindexed, do not execute lab TSX, and do not update the published registry. Run `npm run test:forms-query-draft-preview` before the root/Next browser checks; see [preview acceptance](../../docs/FORMS_QUERY_DRAFT_PREVIEW_ACCEPTANCE.md). The current execution environment could not run the new Next build, so the route still requires candidate-level qualification.

> **Publication check added 2026-11-20:** Run `npm run status:forms-query-promotion` for actionable per-module source, runtime-dependency, canonical-registry and manual-accessibility blockers. `npm run test:forms-query-promotion` checks 16 source/MDX/fixture contracts plus Git release hygiene. `node scripts/forms-query-promotion-readiness.mjs --strict` is **expected to fail** until full module publication and human screen-reader/keyboard/200% zoom evidence exists. Details: [publication readiness](../../docs/FORMS_QUERY_PUBLICATION_READINESS.md). Do not mark `readyToPublish` true or edit the published checkpoint to bypass these gates.

# Forms and Query — 16-lesson prepublication staging

**This directory is not a published course.** It stages the canonical 09.02 React Hook Form and 09.03 TanStack Query topics as individual guided MDX drafts with red starters, instructor solutions, and acceptance contracts.

## Why staging matters

The examples use the locked dependencies in `examples/forms-query-vertical/react-client`. The academy publication registries and the published lab runner receive each module when it is ready for promotion.

Each draft includes a problem, mental model, prediction, three guided implementation steps, a bug hunt, knowledge check, rubric, official references, starter, solution and lab contract. The examples use React Hook Form 7, TanStack Query 5, React 19, TypeScript 5 and Zod 4.

## Promotion gate

1. Use Node 24 and install the root and nested lockfiles with `npm ci`.
2. Run `npm run typecheck:staged --prefix examples/forms-query-vertical/react-client` and `npm run qualify:forms-query:react-browser` with the browser setup in the [project README](../../examples/forms-query-vertical/README.md). All 16 instructor examples passed their assertions in Chrome, and each starter produced its expected assertion failure.
3. Review keyboard, screen-reader announcements, focus and zoom across the staged exercises.
4. Promote one full module (all eight topics) into `src/content/lessons/`, `labs/`, `src/content/lesson-registry.tsx`, `src/lib/academy/published.ts`, `package.json` and `docs/checkpoint.json`.
5. Run the local qualification and academy browser smoke on the publication candidate.

The staging validator in `scripts/verify-forms-query-drafts.mjs` checks metadata, canonical order, required teaching elements and starter/solution file presence. It **does not execute RHF/TanStack** and cannot qualify a lesson by itself.

Related: `examples/forms-query-vertical/WORKBOOK.md`, `docs/FORMS_QUERY_WORKFLOW_V3_ACCEPTANCE.md`.
