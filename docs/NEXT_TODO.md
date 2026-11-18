# Next TODO — Full-Stack Academy

**Updated:** 2026-11-18 · **Current production:** `main@16c2eff` · **Next module:** `01.01` release candidate, followed by `01.02`.  
**Rule:** Mark a task complete only when repository evidence supports it. Keep this file current in every milestone PR.

## P0 — HTML & Web Platform / Module 01.01: Document Structure
- [x] `01.01.01` HTML document anatomy — doctype, html/head/body, parse order, minimal valid page.
- [x] `01.01.02` Head and metadata — charset, viewport, title, description, canonical and social metadata.
- [x] `01.01.03` Semantic landmarks — header, nav, main, footer, aside and accessible page regions.
- [x] `01.01.04` Heading hierarchy — meaningful headings and document outline without visual hierarchy hacks.
- [x] `01.01.05` Text, lists and quotations — semantic paragraphs, lists, figure and blockquote.
- [x] `01.01.06` Links and navigation — anchors, safe external links, meaningful names, keyboard focus.
- [x] `01.01.07` Images and responsive media — alt text, figure, width/height, sizes/srcset, loading behavior.
- [x] `01.01.08` Lab: accessible content page — build an integrated semantic responsive content page and run meaningful static/accessibility tests.
- [x] Authored for each lesson: verified MDX, strict metadata, at least three guided steps, accurate official references, predict-first exercise, quiz, bug hunt, starter, solution, runnable tests, completion rubric.
- [x] Registered published lesson metadata, route and navigation. Planned/unauthored topics must remain `noindex`; sitemap must include only truly authored content.
- [x] Updated `docs/checkpoint.json` to 36 published lessons / 33 MDX / 33 labs and revised handoff files; CI must confirm repository agreement.
- [ ] Verify CI (audit/lint/typecheck/repository tests/catalog+content+checkpoint/labs/build/Chromium), Vercel preview, and mobile/keyboard UX before merge.
- [ ] Merge only after all blocking checks pass. Confirm Vercel production SHA/READY and record release evidence.

## P1 — Security / Reliability / Pedagogy
- [ ] **Deadline: 2026-12-02 UTC:** re-check and resolve Picomatch dev-dependency advisory GHSA-fc5q-39xc-vjpf. Replace the expiring allowlisted exception as soon as compatible fixed versions exist; do not use force downgrades without compatibility testing.
- [ ] Improve content link verification and quiz quality (avoid generic trick answers). Require actual learner-facing expected output.
- [ ] Expand reference articles using a stable contract: syntax, parameters, defaults, returns/errors, tested example, anti-pattern, security/performance notes, official documentation and lesson links.
- [ ] Keep the reading-first UI and accessible navigation. Avoid adding features that crowd the beginner experience.

## P2 — Subsequent milestones
- [ ] `01.02` HTML Forms & Validation; then remaining HTML modules.
- [ ] CSS deep fundamentals, JavaScript, TypeScript, React/Next.js, NestJS/Fastify, PostgreSQL/Prisma/Supabase, security, deployment, observability, and enterprise capstone per `CURRICULUM_MASTER.md`.
- [ ] Plan multi-device sync and sandboxed automated code grading **only** after designing privacy, authorization, compute limits and sustainable cost.
- [ ] Consolidate historical README v1.1 language and build navigation for learning paths and references without inflating UI complexity.

## Definition of done
A module is released only when all eight canonical topics are genuinely authored, each lab and its tests execute, catalog and published metadata agree, planned pages remain noindex, CI and the preview pass, and the merge is reflected by a verified production deployment and updated checkpoint. A green CI run is not equivalent to learner device testing; state those limits explicitly.

## Recently completed (released)
- [x] `00.01`: Computing and internet foundations, 8 lessons.
- [x] `00.02`: Developer toolchain, 8 lessons.
- [x] `00.03`: Learning and debugging process, 8 lessons.
- [x] 4 interactive sample lessons and 4 drafted reference pages retained.
- [x] Stable machine-readable progress checkpoint with CI verification.
- [x] PR #4 merged; 18 repository tests, 63 lab tests, content/production build/Chromium passed.
- [x] Vercel production READY at `main@16c2eff`.
