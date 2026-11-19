# Full-Stack Academy — Current development handoff (2026-11-19)

## Branch and source-truth status

- `main` remains `651fb296`, through previously owner-approved PRs #17–#19. Those PRs did not receive a completed local Node/Next/Chromium qualification in this environment.
- **Draft PR #20:** `feat/nextjs-16-complete-track-offline`, 32 Next.js 16 lessons (07.02–07.05), based on main.
- **Draft PR #21:** `feat/ui-systems-track08-offline`, 32 UI Systems lessons (08.01–08.04) and live component gallery, stacked on PR #20.
- **Current third stacked branch:** `feat/zod4-schema-design-and-live-lab`, based on PR #21 head `56da751`, adding 8 **genuinely Zod 4-powered** lessons and a live profile-validation exercise.
- If all three source candidates are accepted, projected totals are **298 distinct published lesson IDs, 297 MDX lessons and 297 local lab manifests, 37 complete modules, 38 authored reference drafts of 303 indexed topics**; 591/889 canonical topics remain planned. Next `09.02.01`.
- These are source counts, not a live-site or production quality claim. No Vercel or GitHub Actions was inspected.

## This Zod 4 development milestone

- [x] `09.01.01–09.01.08`: strict schemas, primitives/enums, safeParse and nested issues, optional/nullable/defaults, refine/superRefine, transforms/coercion, discriminated unions, composition/inference, validated profile capstone
- [x] Each lesson has three guided steps, real Zod implementation and actual Zod acceptance tests, red starter, rubric, misconception, quiz, official sources and local lab script
- [x] Added shared, strict `src/lib/academy/zod-profile.ts` schema that is consumed by both the browser practice and instructor capstone
- [x] Browser-only `/learn/zod-profile-lab` uses real Zod 4 parsing, field-specific ARIA validation errors and normalized preview with no storage/backend/network
- [x] Added `zod:4` version contract, `lab.zod.*` validator support, publication registry, red starter gate, content integrity checks and local Chromium route/profile smoke contracts
- [x] Completed the **Zod reference index category: 19 of 19** canonical entries now have authored drafts (18 new + existing safeParse); repository-wide total 38/303
- [x] Corrected publication count overlap: `09.01.02` was previously interactive and adds no new unique published lesson ID
- [x] Advanced noindex boundary to `09.02.01` (React Hook Form)

## P0 acceptance — not executable here

- [ ] On exact stacked branch checkout using Node.js 24, run `npm ci && npm run verify:offline` (ESLint, TypeScript, content schema, source tests, 297 instructor labs, negative learners, Next build)
- [ ] Run `npm run test:red-zod-foundations`; all 8 learner starters must fail genuine Zod assertions, not module load failures
- [ ] Start local Next and isolated Chromium smoke in `scripts/browser-smoke.mjs`: published vs planned routes, form errors, normalized email/age, focus, 320px and reset
- [ ] Confirm Zod 4.0+ locked dependency exposes the documented APIs; run package-lock integrity tests on Node 24
- [ ] Reverify previously accepted dev-only Picomatch exception before expiry **2026-12-02 UTC**
- [ ] Keep PR stacking disciplined: qualify/merge #20 first, then rebase/qualify #21, then rebase/qualify current Zod PR

## Next strategic milestone

- `09.02.01–09.02.08`: React Hook Form using `react-hook-form` and `@hookform/resolvers` with **new lockfile-pinned dependencies**. They are not installed in the current repo; do not claim real RHF Controller/useFieldArray tests until installed and run.
- `09.03.01–09.03.08`: TanStack Query v5 requires `@tanstack/react-query` and matching hydration/SSR testing. Avoid faking actual QueryClient behavior with hand-rolled caching helpers.
- `09.04.01–09.04.08`: Zustand v5 is already installed; actual vanilla stores can be tested when work reaches this module.
- Expand other reference index-only categories and maintain calm reading-first mode separated from live practice and quick-reference mode

## Handoff

Read `docs/checkpoint.json`, `docs/ZOD4_SCHEMA_ACCEPTANCE.md`, `AGENTS.md` and `docs/NEXT_TODO.md`. Do not merge draft PRs merely because they are GitHub-mergeable; source inspection and an AI's confidence are not executable quality evidence.
