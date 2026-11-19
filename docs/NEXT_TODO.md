# Full-Stack Academy — Current development handoff (2026-11-19)

## Branch and verification truth

- GitHub `main` is at `651fb296` with previous owner-approved merges #17–#19. Their local test/build qualification was not completed in these GitHub-connector-only sessions.
- **PR #20** (draft): `feat/nextjs-16-complete-track-offline`, adds 32 Next.js lessons 07.02–07.05.
- **Current stacked branch:** `feat/ui-systems-track08-offline` based on PR #20 at `9f41fb2`. It adds 32 UI Systems lessons 08.01–08.04; merge PR #20 first or rebase before integrating this branch.
- Candidate source counts after both PRs: **291 unique published IDs, 289 MDX lessons and local labs, 36 complete modules**, 20 authored reference drafts of 303 indexed subjects. Canonical catalog 889 IDs; 598 remain planned if both source candidates qualify and merge.
- These are **GitHub source counts, not production/hosted metrics**. No Vercel or GitHub Actions was inspected or relied upon.

## Done at source level in Track 08

- [x] `08.01.01–08.01.08`: Tailwind v4, CSS-first tokens, Radix primitives, shadcn Base UI/Radix adapters, typed variants, theme contrast, navigation, component gallery
- [x] `08.02.01–08.02.08`: reduced motion, dialog, combobox/listbox, focus, status announcements, keyboard-reorder drag/drop, chart summaries, inaccessible dropdown debugging
- [x] `08.03.01–08.03.08`: TanStack Table v8 columns, coherent sort/filter/pagination, virtualization, responsive data presentation, loading/error, optimistic changes, safe CSV exports, operational console
- [x] `08.04.01–08.04.08`: hierarchy, typography/color, accessible form errors, usability heuristics, reduced motion, browser matrix, CLS and annotated UX review
- [x] All 32 lessons have strict metadata, sources, three guided steps, quizzes, misconceptions, bug hunts, rubrics, red starters, instructor solutions, Node local tests and lab manifests
- [x] Registered route/metadata and all lab scripts; added source-integrity, red-starter and Chromium smoke contracts
- [x] Browser-only interactive gallery `/learn/ui-gallery`, linked from `08.01.08`: theme, width, variants, form, announcements, code samples; no server-side arbitrary code execution
- [x] Eight new authored CSS/accessibility reference drafts: `var()`, `@media`, `@container`, `@layer`, `:focus-visible`, reduced motion, `color-scheme`, `clamp()`
- [x] Updated planned/noindex boundary to `09.01.01` (first unauthored Zod topic)
- [x] Replace Windows-fragile 11,688-character aggregate lab command with a manifest-driven, fail-fast local runner (batches of 20; source-authored, not executed)
- [x] Checkpoint and developer acceptance handoff

## P0 — Critical acceptance still unexecuted

- [ ] On a complete local clone with Node.js 24, run `npm ci && npm run verify:offline` and repair every failing lint, TS, repo test, content schema, checkpoint, lab or Next build step
- [ ] Run `npm run test:red-ui-track` to confirm all 32 red starters fail meaningful assertions and their instructor solutions pass
- [ ] Run isolated local Next + Chromium `scripts/browser-smoke.mjs`: 32 routes, sitemap/indexability, gallery theme/form/feedback/source interactions, 320px overflow
- [ ] Manual WCAG 2.2 checks: keyboard focus and focus return, screen readers, touch, motion preference, contrast, zoom and responsive visual QA; automated source tests cannot establish these
- [ ] Verify compiled CSS-first Tailwind v4, actual Radix/Base UI behavior and TanStack Table using separately locked dependencies before claiming their integrations work
- [ ] Review known dev-only Picomatch 14-high advisory scope and expiry **2026-12-02 UTC**
- [ ] Qualify PR #20 before merging PR #21; no production-ready claim until local evidence is recorded

## Next coherent milestone

- Track 09: Zod 4 and runtime validation, beginning at `09.01.01`
- Grow the remaining 283 index-only quick references into practical version-aware reference pages
- Keep the product reading-first: guided lesson, browser-only practice and searchable reference are distinct modes

## Successor contract

Start with `AGENTS.md`, `docs/checkpoint.json`, `docs/UI_SYSTEMS_TRACK08_ACCEPTANCE.md`, and `docs/NEXTJS_16_FULL_TRACK_ACCEPTANCE.md`. Any further source count must be calculated from actual files and unique published IDs, not simple arithmetic.
