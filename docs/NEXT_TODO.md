# Full-Stack Academy — Next TODO

**November 19, 2026 · Stacked offline UI design track.** Current branch `feat/08-design-systems-offline`, based on unmerged React+Next branch `edd3a4f` and verified source main `7e8f42d`. **No GitHub Actions or Vercel checks or deployments, no feature PR, and no merge.**

## Completed source authoring — Track 08 (32 canonical topics)

- [x] `08.01` Tailwind v4 and shadcn composition — 8 chapters and offline starter/solution labs
- [x] `08.02` Advanced interactions — 8 chapters covering modal, focus, ARIA, motion, combobox, DnD, toasts and chart accessibility
- [x] `08.03` Data interfaces — 8 chapters covering table state, virtualized lists, mobile alternatives, private data, export and operational console
- [x] `08.04` Design QA — 8 chapters covering spacing, typography, forms, usability, reduced motion, cross-browser, CLS and a release audit
- [x] Register all 32 MDX articles/metadata, lab commands and lesson routes
- [x] Repair an earlier integration omission by including all **79 React+Next** and **32 UI** MDX labs in `LOCAL_LAB_LESSONS` rubric lookup
- [x] Replace the 11.4 KB all-labs command with `scripts/run-all-labs.mjs` to avoid Windows command-line length limits
- [x] Author module-specific static, MDX/TSX parser, red starter and Chromium browser checks; **not yet executed with npm dependencies**

## Next actual verification steps — local only

- [ ] `npm ci` with the repo's supported Node 24 and locked dependency versions
- [ ] `npm run verify:ui:cheap`: structure, MDX/TS parser, previous React/Next and reference checks, updated wave manifest
- [ ] `npm run test:ui:offline && npm run test:ui:red` (32 green instructor fixtures and 32 intentionally red student fixtures)
- [ ] `npm run test:labs` — full 289-fixture suite via 19 bounded batches
- [ ] `npm run lint && npm run typecheck && npm run build` in an isolated local workspace
- [ ] Local Chromium smoke: all four UI modules, 320px mobile, page index/noindex/sitemap and previous track regressions
- [ ] Browser interaction tests for modal focus, keyboard reorder, ARIA announcements, theme contrast, reduced motion and real shadcn/Radix/TanStack primitives
- [ ] Fix actual failed checks, review for security/accessibility and update exact-head evidence. Do **not** merge unverified content.

## Large-scope continuation after QA

- [ ] W01 continuation: **63 unauthored canonical topics** in `09` (Zod, forms, client data) and `10` (Node/HTTP APIs). `09.01.02` is already an interactive model; avoid double-counting.
- [ ] W02–W07: remaining **535 unauthored IDs**, organized in complete backend, data, identity, async, testing, DevOps, enterprise and capstone waves.
- [ ] Reference encyclopedia: 20 detailed drafts of 303 indexed subjects; editorial and UI testing remain pending.
- [ ] Temporary dev-only dependency exception expires 2026-12-02; reassess before release.

**Current branch candidate:** 291 unique authored lesson IDs, 289 MDX articles, 289 local labs, 36 complete modules, 20 detailed reference drafts; **598 lesson IDs still unauthored** of 889. Live deployment remains on the historical, separately verified 61-lesson application baseline. Start with `docs/UI_TRACK_ACCEPTANCE.md`, `docs/checkpoint.json`, `docs/delivery-waves.json`, and `docs/OFFLINE_HANDOFF_2026_11_19.md`.
