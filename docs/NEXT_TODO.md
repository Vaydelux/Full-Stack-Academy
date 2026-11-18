# Full-Stack Academy — Next TODO

**Updated:** 2026-11-18 · **Last verified production:** `main@4067cce`.  
**Priority milestone:** Module `01.03` Accessibility (nine canonical topics). Publication count is from `docs/checkpoint.json`; the catalog's 889 planned topics are not 889 finished lessons.

## P0 — Module 01.03: Accessibility
- [x] `01.03.01` Keyboard-first navigation — tab order, visible focus, skip links, activation patterns; Chromium keyboard tests.
- [x] `01.03.02` Focus management — modal focus restoration, DOM updates, native tab boundaries; no custom traps by default.
- [x] `01.03.03` Screen reader semantics — meaningful landmarks, heading structure, status/alert roles; inspect accessibility tree.
- [x] `01.03.04` WCAG principles — perceivable, operable, understandable, robust; relate requirements to real testable user journeys rather than claim automatic conformance.
- [x] `01.03.05` Color contrast — compute WCAG contrast, test text and focus visibility; provide visual alternatives rather than relying on hue alone.
- [x] `01.03.06` Accessible names and descriptions — labels, aria-labelledby/aria-describedby, naming precedence and localized instructions.
- [x] `01.03.07` Images and alternative text — informative vs decorative images, diagrams, complex figures, meaningful accessible descriptions.
- [x] `01.03.08` Reduced motion — CSS prefers-reduced-motion, pause/stop, avoid unwanted animation and respect OS preference.
- [x] `01.03.09` Lab keyboard audit — repair a representative document and confirm responsive keyboard navigation, focus, labels and semantic errors in real Chromium.
- [x] Authored each lesson with strict metadata, MDX explanation, 3+ guided steps, official HTTPS sources, predict-first example, misconception, bug hunt, knowledge check, starter and solution fixtures, executable tests and accurate rubric.
- [x] Registered published lesson metadata and MDX routes, update sitemap and learning cards; next planned module remains noindex.
- [x] Updated `docs/checkpoint.json` for 53 lessons / 50 MDX / 50 labs, plus handoff documents; CI checkpoint verification still required. The security exception remains pending.
- [ ] CI gate: lint, TypeScript, repository tests, curriculum, MDX metadata/content, checkpoint consistency, all labs, Next production build, Chromium browser interactions, dependency audit and Vercel preview.
- [ ] Merge only on green; verify production main SHA and READY; finalize checkpoint.

## Next after 01.03 release: Module 01.04 — Web APIs & Security
- [ ] Eight topics `01.04.01`–`01.04.08`: DOM/rendering, Fetch/JSON, URL APIs, storage/cookies, permissions/clipboard, same-origin/CORS, CSP/isolation and DevTools request lab. Preserve security boundaries.

## P1 — Security, reliability, and quality
- [ ] **By 2026-12-02 UTC:** re-evaluate the dev-only Picomatch GHSA-fc5q-39xc-vjpf advisory and end its expiring exception when compatible fixed packages exist. Do not force-downgrade Next/ESLint in ways that break compatibility.
- [ ] Expand verified reference entries (currently four drafted out of 303 indexed) using syntax, behavior, errors, safe tested examples and official references.
- [ ] Improve real-device assistive technology audit coverage; automated Chromium checks do not certify compliance.
- [ ] Maintain isolation: no student arbitrary code/MDX executed on trusted server and no fabricated claims of submissions or progress sync.

## P2 — Later curriculum
- [ ] Complete remaining HTML/Web Platform modules after `01.03`; then CSS, JavaScript, TypeScript, React/Next.js, APIs, databases, security, deployment and full-stack capstone.
- [ ] Consolidate older README v1.1 descriptions and progressively improve navigation without recreating a crowded interface.
- [ ] Design signed cloud progress or remote grading only after privacy, authorization, compute and cost analysis.

## Definition of done
All canonical IDs of a module have complete lesson bodies and local tests, are registered and indexable; planned pages stay noindex; GitHub quality + audit checks and Vercel preview pass; the merged `main` SHA is served as READY in production; checkpoint is updated. Any manual screen-reader checks not performed must remain clearly identified as unverified.

## Recently completed
- [x] Orientation 00.01, 00.02, 00.03 — 24 authored lessons.
- [x] HTML Document Structure 01.01 — eight standalone HTML labs.
- [x] HTML Forms & Validation 01.02 — eight browser-native labs, including inaccessible-form repair.
- [x] PR #8 merged with 18 repository tests, 104 lab tests, 41 MDX validations and Chromium verification passed on head.
- [x] Live production `/learn/01.02.08` confirmed HTTP 200; Vercel READY `main@4067cce`.
- [x] Durable AI handoff maintained with CI-checkable publication counts.
