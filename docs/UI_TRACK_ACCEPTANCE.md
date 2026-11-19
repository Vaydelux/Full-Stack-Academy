# UI Systems Track 08 — Offline Quality and Acceptance

**Date:** 2026-11-19 · **Feature:** `feat/08-design-systems-offline` stacked on unmerged React/Next source · **Deployment hold:** No GitHub Actions inspection/execution, no Vercel deployment, no PR/merge.

## Authored curriculum — 32 topics, four complete modules

| Module | Scope | Lessons | Qualification level |
|---|---|---:|---|
| 08.01 Tailwind & shadcn/ui | CSS-first setup, semantic tokens, Radix selection, component composition, class merge, contrast, nav, gallery | 8 | MDX + synthetic TS contract + React initial SSR fixture; library integration unverified |
| 08.02 Advanced Interaction | Motion, modal, combobox, keyboard focus, announcements, DnD, charts, dropdown bug hunt | 8 | Pure local policies plus initial React semantics; actual keyboard behaviors unverified |
| 08.03 Professional Data Interfaces | Table columns, sorting/filtering, virtual range, mobile cards, states, optimistic actions, CSV safety, ops console | 8 | Pure local policies plus initial React semantics; actual TanStack integrations unverified |
| 08.04 Design QA | Spacing, color and typography, forms, heuristics, reduced motion, browser support, layout shift, UX review | 8 | Pure local policies plus initial React semantics; browser/assistive tech unverified |

All lessons include three explicit guided steps, prediction, bug hunt, four-choice quiz, official references, standalone `starter/solution.ts`, reviewed `solution/solution.ts` and `Widget.tsx` React examples. The TS contract exercise is **not** a substitute for actual Radix, shadcn, TanStack Table or Motion package execution.

## Correctness and security design standards

- UI controls need semantic labels, native buttons and keyboard accessible actions; WAI-ARIA attributes are not a complete implementation of focus traps or menus.
- Tailwind v4 must use CSS-first `@import "tailwindcss"` and `@theme`; do not teach obsolete `@tailwind base` conventions as current.
- shadcn/ui requires an intentional primitive choice (Radix or Base UI) and installed source code; don't assume Radix is always the default.
- Contrast lesson uses the WCAG relative luminance math and the 4.5:1 normal-text target. Actual computed styles must be measured in all themes.
- The operations console fixture filters synthetic tenants locally to illustrate projections only; **real authorization requires authenticated server queries and data isolation.**
- CSV cell handling demonstrates dangerous formula prefixes; production export requires complete encoding/locale/spreadsheet validation.
- Visual correctness requires 320px and 200% zoom, reduced motion, focus visibility, screen readers, browser-engine variation, and measured layout shift.

## Test gates

- [x] Authored 32 canonical MDX articles, metadata files, 32 offline labs, TSX initial semantic widgets and local lab scripts
- [x] Wired all four UI modules in lesson registry, sitemap/published metadata, checkpoint and lab rubric lookups (including 79 previously missing React/Next entries)
- [x] Shortened the 11.4 KB Windows-hostile `test:labs` script to a deterministic 16-lab-per-batch local runner
- [x] Wrote dedicated `check:ui:structure`, `check:ui:syntax`, `test:ui:offline`, `test:ui:red` and `scripts/ui-track-smoke.mjs`
- [ ] Run `npm ci` and `npm run verify:ui:cheap` locally; inspect all parser and schema diagnostics
- [ ] Run all 32 **green** instructor and 32 **red** student lab cases; do not accept syntax/module failure as a valid red test
- [ ] Run **all 289 lab fixtures** through `npm run test:labs`, repository tests, lint, strict TypeScript and Next production build locally
- [ ] Execute local Chromium four-module route/mobile/sitemap checks plus all previous academy regressions
- [ ] Confirm keyboard and screen-reader modal/combobox/dropdown/drag/announcement behavior; test physical devices and browser engines
- [ ] Review the 14 high dev-tool advisory exception before 2026-12-02 UTC expiry

**Reported state:** Complete source authoring, **not** successful local build or published website. Do not merge until observed tests and editorial review pass.

## Source preflight snapshot (2026-11-19)

- [x] Nontruncated tree: **289 MDX files, 289 metadata records, 289 lab manifests**; all 32 new UI Widget.tsx paths exist
- [x] Each of the 32 new metadata documents has matching canonical id/module/level and at least three objectives plus two sources
- [x] Delivery waves reconcile to 598 still-unauthored topics, with W01 track 08 source-authored and tracks 09–10 next
- [ ] Actually execute Node24, TS/tsx, MDX and Chromium; current review remains **static only**
