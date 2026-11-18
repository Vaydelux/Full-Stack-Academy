# Full-Stack Academy — Next TODO

**Updated:** 2026-11-18 · **Active branch:** `feat/02-01-css-fundamentals-offline` · **Deployment mode:** intentionally skipped; production remains on previously released content.

## P0 — Verify Module 02.01 offline (unreleased)

- [x] Author all eight CSS Fundamentals lessons with strict metadata, prediction, guided steps, quizzes, bug hunts, reviewed official HTTPS links and self-assessment.
- [x] Add eight local HTML starter/solution sets, local Node regression tests and focused browser-rendering assertions.
- [x] Register eight authored lessons in MDX/metadata publication registries; update lab scripts.
- [x] Record development-only snapshot: 66 MDX, 69 published IDs, 66 labs, eight complete modules.
- [ ] Run exact-head checks: npm ci, lint, typecheck, test, validate, verify:content, checkpoint:check, test:labs, build, browser-smoke and dependency audit.
- [ ] Review source and verify keyboard, RTL, zoom, 320px viewport on an actual device if possible; automated Chromium does not constitute a WCAG audit.
- [ ] Keep this branch unmerged **while Vercel releases are paused**; no Vercel preview or production deployment should be created. User will decide when to resume release and quota consumption.
- [ ] Once release is explicitly resumed, re-run gates, inspect exact-head staging, merge through a reviewed PR, and record production READY.

## P1 — Security and content quality

- [ ] Re-evaluate the 14 high development-only Picomatch findings by 2026-12-02 UTC; temporary exception does not remove vulnerabilities.
- [ ] Expand authored reference encyclopedia (4 drafted from 303 indexed subjects).
- [ ] Add actual manual screen-reader, keyboard, and responsive device test evidence.
- [ ] Improve verified lesson depth and accessibility; never claim an unauthored topic is published.

## P2 — Next after CSS Fundamentals

- [ ] Author the next canonical module `02.02` as defined in `data/curriculum.json`.
- [ ] Continue JavaScript, TypeScript, React, Next.js, API/backend, persistence, authentication, security, deployment and end-to-end capstone in canonical order.

## Released baseline

- PR #12 released seven complete modules through `01.04` (61 published IDs, 58 MDX, 58 labs).
- PR #13 reconciled the documentation checkpoint; main was `d7e8203` when this branch was created.
- **Do not conflate unpublished branch content with what production visitors can access.**
