# UI Systems Track 08 — Offline-first source acceptance

**Date:** 2026-11-19 · **Feature branch:** `feat/ui-systems-track08-offline` · **Stacked base:** draft Next.js PR #20 at `9f41fb2`.

## Curriculum delivery

All four UI Systems modules (`08.01`–`08.04`) have eight canonical topics each: **32 MDX lessons and strict JSON metadata + 32 red starters, 32 instructor solutions, 32 Node tests and 32 local lab manifests**. Each lesson has three numbered steps, conceptual teaching, prediction, a failing example, a correct repair, a bug hunt, a misconception, an explicit quiz, official documentation and learner rubric.

A separately authored, browser-only React component gallery is under `/learn/ui-gallery`. It supports controlled light/dark preview, desktop/mobile preview width, button intent variants, form validation with associated ARIA errors, status announcements and a source-code disclosure. It is linked from the component-gallery capstone at `08.01.08`. It does not install or load shadcn, Radix or third-party UI code.

Eight additional CSS reference drafts in the modern reference explorer bring authored drafts to **20/303** indexed subjects. Their canonical IDs are `css-var`, `css-media`, `css-container`, `css-layer`, `css-focus-visible`, `css-prefers-reduced-motion`, `css-color-scheme` and `css-clamp`.

## Technical boundaries

- Tailwind v4 is **CSS-first**: `@import "tailwindcss"`, CSS `@theme`, proper PostCSS integration. No legacy v3 setup assumptions.
- Modern shadcn/ui may use **Base UI by default** for newly created projects; Radix remains an alternative. Do not combine provider-specific imports blindly.
- Only tested/reviewed local TSX source fixtures run under the exercise scripts. A static lab model is not a compiled Radix, shadcn or TanStack example.
- Interaction content follows WAI-ARIA APG semantics, WCAG 2.2 and reduced-motion preferences, but browser/assistive-tech compliance has **not** been verified.
- Table content distinguishes TanStack Table **v8** client-managed row models from server-owned pagination/sort/filter. CSV export warns about formula injection.
- No public remote code execution, paid providers or hosted dependency in this milestone.

### Windows-safe local lab execution

The previous `package.json` `test:labs` command grew to **11,688 characters** with 289 file paths and was at risk of hitting Windows `cmd.exe` command-length limits. This feature branch replaces it with `node scripts/run-local-labs.mjs`: it discovers only checked-in `labs/*/lab.json` tests, validates in-repo paths, rejects duplicates, and runs `node --import tsx --test` in bounded groups of 20 with no shell. The source configuration has been checked, but the new runner **has not been executed in this environment**. A local Node 24 checkout must prove it works with existing and newly authored tests.

## Source counts after stacking

- 889 canonical lesson topics across 28 tracks and 111 modules
- **291 unique published lesson IDs**, 289 MDX lessons and 289 local lab manifests
- **36 complete modules**
- **20 authored API reference drafts** and 303 indexed reference subjects
- **598 planned topics** remain, starting at `09.01.01`

These are source-candidate figures, not tests passed or live website measurements.

## Qualification script — not executed

```bash
npm ci
npm run verify:offline
npm run test:red-ui-track
```

The offline verification script now includes the new red-starter gate. Follow with a separately running local Next server and isolated Chromium `scripts/browser-smoke.mjs`, including `scripts/ui-track-smoke.mjs` and `scripts/ui-gallery-smoke.mjs`.

Manual testing is required for focus containment and restoration, keyboard and touch, screen-reader announcements, high contrast, 320px and 200% zoom, reduced motion, and layout stability. Source-level files and Node model tests do **not** establish accessibility conformance.

The model's container cannot resolve the public GitHub host for a complete clone, so no locked install, TypeScript compiler, Next build, instructor/red test suite or local browser integration executed here.

## Merge order and next focus

PR #20 (Next 07.02–07.05) is the base and remains draft. Qualify/merge it first, then recheck this stacked UI PR against main. No Vercel or GitHub Actions inspection was performed. The next canonical topic after Track 08 is Zod 4 `09.01.01`.
