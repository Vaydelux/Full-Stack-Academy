# Full-Stack Academy — Next TODO

**Updated:** 2026-11-18 · **Last verified app release:** `main@394e6d0` · **Next P0:** `02.01 — CSS Fundamentals`.

The catalog maps **889** topic IDs, but only **61** are authored/published. Next module is `02.01`; there is **no `01.05` module** in the canonical catalog.

## P0 — Module 02.01: CSS Fundamentals

- [ ] `02.01.01` Selectors and combinators — selectors, specificity-independent matching, descendant/child/sibling differences, realistic failure diagnosis.
- [ ] `02.01.02` Cascade specificity and inheritance — origin, importance, specificity, order, inherited and non-inherited properties; avoid misleading “highest specificity always wins.”
- [ ] `02.01.03` Cascade layers — `@layer` precedence, normal versus important declarations, defensible reset/component/utility organization.
- [ ] `02.01.04` Box model and sizing — content, padding, border, margin, `box-sizing`, intrinsic constraints and overflow.
- [ ] `02.01.05` Units and typography — `rem`, `em`, `ch`, `px`, viewport units, fluid typography, zoom and text resize behavior.
- [ ] `02.01.06` Logical properties — writing-mode and direction-safe spacing, sizes, alignment and internationalization cases.
- [ ] `02.01.07` Pseudo classes and states — `:focus-visible`, `:hover`, `:disabled`, `:has()`, state semantics and keyboard/touch parity.
- [ ] `02.01.08` Lab responsive content card — integrated responsive, accessible, direction-safe CSS with mobile and zoom inspection.
- [ ] Publish eight genuinely authored MDX lessons with strict metadata, at least three guided runnable steps each, source links, predictions, quizzes, bug hunts, offline starter/solution, executable Node tests and browser behavior checks.
- [ ] Register all articles/metadata, update `docs/checkpoint.json`, checkpoint and this TODO; keep planned `02.02` routes **noindex** and out of sitemap.
- [ ] Require npm ci, dependency audit, lint, typecheck, repository tests, content/checkpoint verification, all labs, Next build, isolated Chromium and exact-head Vercel preview before merge. Confirm production READY on merged SHA.

## P1 — Security, accessibility and editorial debt

- [ ] **By 2026-12-02 UTC:** resolve or re-evaluate the **14 high development-only Picomatch findings** from `GHSA-fc5q-39xc-vjpf`. Current exception is temporary, not a fix.
- [ ] Perform manual real-device keyboard, screen-reader, zoom and mobile testing; local Chromium checks are not an independent WCAG assessment.
- [ ] Expand the reference encyclopedia beyond four authored drafts toward 303 catalogued subjects.
- [ ] Consolidate legacy README narrative without disturbing the calm reading-first layout.
- [ ] Reconcile historical Vercel/CI references after later documentation-only deployments; keep app-release baseline distinguishable from current head.

## P2 — Subsequent curriculum and platform

- [ ] Continue CSS, JavaScript, TypeScript, React/Next.js, backend services, PostgreSQL/Prisma/Supabase, infrastructure, security, and end-to-end capstones.
- [ ] Consider authenticated progress sync or remote grading only with concrete privacy, isolation, free-tier budget and security design.

## Released history

- [x] `00.01`, `00.02`, `00.03` — 24 orientation/foundations lessons.
- [x] `01.01` — eight HTML document structure lessons.
- [x] `01.02` — eight HTML forms and validation lessons.
- [x] `01.03` — nine accessibility lessons including keyboard audit capstone.
- [x] `01.04` — eight Web APIs & Security lessons with offline tests, [PR #12](https://github.com/Vaydelux/Full-Stack-Academy/pull/12), post-merge CI [44321173715](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44321173715), and READY production Vercel `dpl_5CsySTxdf8iRD2zQ1wpL4xcTBstX`.
- [x] Verified at application release: 61 published IDs, 58 MDX articles, 58 local fixtures, seven complete modules; 828 planned topics remain.

**Definition of done:** all canonical topic IDs have actual authored content and working practice fixtures; metadata/registry/sitemap are truthful; every release gate passes on exact-head code; production SHA and live behavior match; no unsupported compliance or cloud persistence claims.
