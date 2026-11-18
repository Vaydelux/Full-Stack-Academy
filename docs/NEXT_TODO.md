# Full-Stack Academy — Next TODO

**Updated:** 2026-11-18 · **Verified production:** `main@2e11d08` · **Active next milestone:** `01.02`.

## P0 — Module 01.02: HTML Forms & Validation
- [x] `01.02.01` Labels, controls and fieldsets — explicit programmatic labels, grouped choices, helpful instructions; use actual browser accessibility assertions.
- [x] `01.02.02` Input types and native validation — required, min/max, pattern, email, and constraint validation messages; validate on server again in production.
- [x] `01.02.03` Buttons and form submissions — submit vs button/reset defaults, GET/POST semantics, named fields, safe synthetic endpoints.
- [x] `01.02.04` Progressive enhancement — a functional form without JavaScript, enhanced with optional client script and clear error/success states.
- [x] `01.02.05` File inputs — accept hints, file size/type validation, multipart form, no unsafe client-file assumptions; browser fixture only.
- [x] `01.02.06` Dialog, popover and details — native keyboard behavior, focus semantics, disclosure vs modal, appropriate close interactions.
- [x] `01.02.07` Native events and default behavior — submit, input, change, preventDefault, propagation; test keyboard defaults and accessible feedback.
- [x] `01.02.08` Bug Hunt inaccessible form — fix an intentionally flawed standalone form and verify labels, focus, errors and mobile layout in Chromium.
- [x] Authored each lesson: reviewed MDX, strict metadata, three or more guided steps, legitimate HTTPS official references, prediction, quiz, bug hunt, starter, worked solution, tests and completion rubric.
- [x] Registered metadata and MDX components in both registries; ensure new routes indexable and the next planned module noindex; update sitemap and beginner navigation.
- [x] Updated `docs/checkpoint.json` with branch counts; checkpoint CI verification pending. Security exception still requires review by 2026-12-02.
- [ ] Pass GitHub audit + lint + typecheck + repository tests + content/checkpoint + lab suites + production build + Chromium; verify exact-head Vercel preview and mobile/keyboard behavior before merge.
- [ ] Confirm production READY and main commit SHA after merge; reconcile the checkpoint.

## Next after release: Module 01.03 — Accessibility
- [ ] Author nine exact canonical topics `01.03.01`–`01.03.09`: keyboard navigation, focus, screen reader semantics, WCAG, contrast, accessible names, images, reduced motion, keyboard audit lab. Publish only complete, verified lessons.

## P1 — Release safety and content quality
- [ ] **By 2026-12-02 UTC:** review `GHSA-fc5q-39xc-vjpf` Picomatch development-only exception and remove once compatible fixed releases are available. Never force-downgrade the Next.js ESLint toolchain untested.
- [ ] Maintain a safe local-first practice model; no arbitrary code execution in the Next.js server or untrusted remote MDX compilation.
- [ ] Improve semantic accessibility audits (keyboard and assistive-tech), automated dead source-link checks, and quiz answer plausibility.
- [ ] Grow the independently browsable reference encyclopedia with verified syntax and runnable examples; only publish finished articles.

## P2 — Subsequent milestones
- [ ] Complete remaining HTML & Web Platform modules after `01.02`.
- [ ] Teach CSS, JS, TS, React/Next.js, NestJS/Fastify, PostgreSQL/Prisma/Supabase, security, deployment, observability and the CollabSpace capstone as planned.
- [ ] Consider signed progress sync or hosted grading only after a privacy, security and cost analysis.

## Definition of done
A module is released only when every canonical lesson is genuinely authored and indexed, each local fixture and browser interaction is tested, the full CI and audit are green, preview is verified, and `main` production READY SHA matches the merged release. Clearly distinguish self-assessed practice from independently verified instructor tests.

## Recently completed
- [x] `00.01`, `00.02`, `00.03`: entire 24-lesson Orientation & Foundations track.
- [x] `01.01`: HTML Document Structure, eight lessons with standalone HTML fixtures and responsive accessible capstone.
- [x] PR #6 merged; its head passed 18 repository tests, 80 lab tests, 33 MDX validations and Chromium browser checks.
- [x] Production READY for `main@2e11d08` and live capstone page confirmed.
- [x] Machine-readable checkpoint maintained and enforced by CI.
