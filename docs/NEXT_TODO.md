# Full-Stack Academy — Next TODO

**Updated:** 2026-11-19 · **Offline batch:** CSS track `02.01` through `02.04` · **Target PR:** #14 (draft / do not merge) · **Vercel:** no builds/previews, existing production unchanged.

## P0 — Verify all 32 CSS lessons as one batch

- [x] Module `02.01` — CSS Fundamentals (8 authored lessons and local labs; previously passed CI).
- [x] Module `02.02` — Layout Engineering (Flexbox, Grid, intrinsic sizes, stacking, scrolling, container queries, breakpoints, sticky bug hunt).
- [x] Module `02.03` — Modern CSS & Design Systems (tokens, contrast, color schemes, reduced motion, nesting, :has, scope, themed component kit).
- [x] Module `02.04` — Performance & Accessibility (layout/paint, selector audits, transforms, CLS, scroll motion, DevTools, visual regression, 100-point QA capstone).
- [x] All 24 new lessons have MDX, strict metadata, three guided steps, misconception, quiz, bug hunt, two official sources and offline starter/solution/Node test.
- [x] Added interactive Chromium assertions, typed publication registration, local verifier commands, and reproducible QA rubric/baseline files.
- [ ] Run **exact-head** GitHub CI: npm ci, dependency audit, lint, typecheck, repository tests, content/checkpoint validation, 90 offline lab fixtures and Next build, then isolated Chromium behavior.
- [ ] Fix all discovered regressions and re-run until green; a syntax-level Node assertion does not replace real browser behavior.
- [ ] Keep PR #14 **draft and unmerged**, do not enable Vercel previews/builds, and do not change the live site while releases are on hold.
- [ ] Manual review remains required for physical screen readers, 200% zoom, real font-loading CLS and performance traces; do not claim automatic certification.

## P1 — Deepening the entire academy, not rushing individual releases

- [ ] Next batch: `03.01`–`03.04` JavaScript Deep Foundations, **32 canonical topic IDs**, independent local lab checks and one batch gate. User requests larger coherent increments, not skipped pedagogy.
- [ ] Next batch after that: `04.01`–`04.04` TypeScript & Type-System Design, **32 canonical topic IDs**.
- [ ] Continue React/Next, backend/data, testing/security/DevOps, and capstone batches in the precise catalog order.
- [ ] Broaden the technical reference encyclopedia: 303 indexed subjects versus 4 genuinely authored drafts.
- [ ] Re-evaluate the **14 high dev-only Picomatch reports by 2026-12-02 UTC**. The exception is temporary, not a patch.

## P2 — Release when explicitly resumed

- [ ] Lift the Vercel ignored-build/preview-disable settings only when the owner opts in.
- [ ] Verify exact-head Vercel preview and manual browser/accessibility criteria; merge only after release gate, then verify production READY at the merged main SHA.
- [ ] Publish truthful counts: branch after this batch **93 lessons** (90 MDX; 4 interactive models and one duplicate ID), **90 lab fixtures**, **11 complete modules**. Live production still **61 lesson IDs**.

Read `docs/LONG_SCOPE_DELIVERY_PLAN.md` for the multi-track batching strategy and quality gates. Never imply all 889 catalog topics or 303 references are already written.
