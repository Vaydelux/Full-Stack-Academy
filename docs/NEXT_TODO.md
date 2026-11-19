# Full-Stack Academy — Current development handoff (2026-11-19)

## Confirmed GitHub base and stacked PR order

- `main`: `651fb296` following prior owner-approved merges #17–#19. Their full local test/build qualification was not executed in the connector-only environment.
- Draft PR **#20**: `feat/nextjs-16-complete-track-offline`, Next.js 16 lessons 07.02–07.05, based on main.
- Draft PR **#21**: `feat/ui-systems-track08-offline`, full Track 08 lessons and browser-only component gallery, stacked on #20.
- Draft PR **#22**: `feat/zod4-schema-design-and-live-lab`, real Zod 4 lessons/labs and browser-only profile validation, stacked on #21.
- **Current branch:** `feat/zustand5-state-boundaries-live`, based on PR #22 head `d3180b0`, adds the full **09.04 Zustand 5** module. Do not merge it before its predecessors without rebasing.
- Proposed cumulative source snapshot: **306 unique published IDs, 305 MDX lessons, 305 lab manifests, 38 complete modules, 38 authored reference drafts of 303 indexed subjects**. Total catalog 889; **583 still planned**. `09.02.01` remains the first unauthored canonical lesson.
- These are SOURCE counts, not published website metrics or executable quality evidence. No Vercel or GitHub Actions checks.

## This milestone — 09.04 Zustand 5 (done at source level)

- [x] `09.04.01–09.04.08`: local/URL/server state boundaries, selectors + subscribeWithSelector, persist partialize with a token exfiltration trap, derived state, multi-tab revision messages, URLSearchParams, avoiding duplicated remote caches, filters/preferences capstone
- [x] Eight genuinely Zustand 5-powered vanilla stores with deliberately failing typed learner starters, instructor solutions and Node acceptance tests; no new dependencies because Zustand ^5 is already listed
- [x] Corrected the intentionally broken starters to remain type-safe, avoiding false red gates caused by compile errors
- [x] Per-mount `src/lib/academy/zustand-filters.ts` store factory with stable primitive selectors, typed actions and no remote records in global state
- [x] Browser-only `/learn/state-boundaries-lab`: query, course/reference types, density options, reset, live results count, URL representation preview and code disclosure; no backend, localStorage or arbitrary-code execution
- [x] Registered MDX/metadata, `zustand:5` stack version, `lab.zustand.*` schema support, eight npm lab commands, aggregate lab discovery, red-starter gate and browser route/gallery smoke
- [x] Strengthened all eight historical red-starter suites to require actual `ERR_ASSERTION` output (not generic import-error TAP failures), and added a source integrity guard
- [x] Publication integrity tests and updated handoff. Noindex boundary **stays 09.02.01** because RHF and TanStack Query remain unauthored; intentional out-of-order work does not pretend they're finished

## P0 — Required executable qualification, still unexecuted

- [ ] Obtain a full local checkout with Node.js 24 and locked dependencies, then run `npm ci && npm run verify:offline` (lint, typecheck, source/content tests, 305 instructor labs, all red starter gates, Next production build)
- [ ] Run `npm run test:red-zustand-state`: all eight intentionally broken learners must fail substantive store assertions, never missing imports or compiler errors
- [ ] Local Next + isolated Chromium `scripts/browser-smoke.mjs`: eight authored Zustand routes, noindex at planned 09.02.01, gallery search/type/density/reset, 320px width, source code toggle
- [ ] Verify Zustand 5 persist `createJSONStorage`/partialize in the actual locked dependency version; never store credentials in browser storage
- [ ] Confirm React Strict Mode/hydration and verify stable selector output and store lifecycle in the live gallery, keyboard and screen-reader behavior, zoom and reduced-motion acceptance
- [ ] Review historical dev-only Picomatch advisory exception before **2026-12-02 UTC**
- [ ] Qualify and merge PRs in order (#20 → #21 → #22 → current Zustand PR), rebasing and repeating the full gate against each resulting head

## Next coherent major milestone (currently blocked by dependencies)

- `09.02.01–09.02.08`: **React Hook Form**. Add real compatible `react-hook-form` and `@hookform/resolvers` to package.json and regenerate/test the lockfile; teach actual useForm, register, Controller, useFieldArray, Zod resolver, submit, focus and errors.
- `09.03.01–09.03.08`: **TanStack Query v5**. Add and lock `@tanstack/react-query`; test actual QueryClient, key scope, mutations, rollback, infinite query, SSR and cancellation rather than fake cache models.
- Keep `09.04` independently learnable but mark its position as an intentional dependency-aware delivery exception.
- Continue the **38/303** searchable reference drafts toward comprehensive version-aware reference coverage.

## Handoff contract

Read `docs/STATE_BOUNDARIES_ZUSTAND5_ACCEPTANCE.md`, `docs/checkpoint.json`, `AGENTS.md`, `docs/NEXT_TODO.md`. Do not conflate GitHub mergeability with a verified build, or a source-only exercise with proof of real browser/tenant security.
