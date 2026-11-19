# Forms and Query — 16-lesson prepublication staging

**This directory is not a published course.** It stages the canonical 09.02 React Hook Form and 09.03 TanStack Query topics as individual guided MDX drafts with red starters, instructor solutions, and acceptance contracts.

## Why staging matters

The production registry (`src/content/lesson-registry.tsx`, `src/lib/academy/published.ts`) and `labs/` are intentionally untouched. The lab runner automatically executes every registered lab, and the root runtime has not installed/locked react-hook-form, @hookform/resolvers or @tanstack/react-query. Publishing these files before real npm/Next/browser qualification would misrepresent verification.

Each draft includes: problem, mental model, prediction, three guided implementation steps, a realistic bug hunt, knowledge check, private security boundary, primary and secondary official references, red starter, solution, lab.json contract and test plan. Examples use React Hook Form v7, TanStack Query v5, React 19, TypeScript 5 and Zod 4. **These version targets are advisory until npm resolves and writes its own lockfile.**

## Promotion gate

1. Generate a real trusted `package-lock.json` using npm from compatible RHF, Zod resolver and TanStack Query packages on the actual Node 24 checkout.
2. Inspect and run each staged solution against real packages. Write runnable positive assertions and a reproducibly failing negative starter for each lesson. Use React Testing Library/Vitest or the academy's established harness, not regex-only source assertions.
3. Fix TypeScript and accessibility issues in each example; exercise keyboard and screen reader errors at mobile widths.
4. Promote an entire module (all 8 topics) atomically into `src/content/lessons/`, `labs/`, `src/content/lesson-registry.tsx`, `src/lib/academy/published.ts`, `package.json` and `docs/checkpoint.json`.
5. Run local `npm ci && npm run verify:offline` and nested React typecheck/build before marking any lesson `authored` or `verified`. Do not bypass release gates based on AI confidence.

The staging validator in `scripts/verify-forms-query-drafts.mjs` checks metadata, canonical order, required teaching elements and starter/solution file presence. It **does not execute RHF/TanStack** and cannot qualify a lesson by itself.

Related: `examples/forms-query-vertical/WORKBOOK.md`, `docs/FORMS_QUERY_WORKFLOW_V3_ACCEPTANCE.md`.
