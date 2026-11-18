# Next TODO — prioritized handoff queue

**Updated:** 2026-11-18. **Current focus:** Module 00.03. Tasks show actual states; do not infer completion from planned curriculum.

## P0 — Release next complete module (00.03)
- [x] `00.03.01` Read error messages from bottom up — real nested-error fixture, stack/cause diagnosis, regression tests.
- [x] `00.03.02` Reproduce, minimize and isolate bugs — deterministic reduction fixture + isolated reproduction tests.
- [x] `00.03.03` Debugger breakpoints and watches — buggy code to repair, VS Code/Node inspector guide, regression test.
- [x] `00.03.04` Console, Network and Performance panels — instrument/diagnose safe local requests; deterministic timing tests.
- [x] `00.03.05` Asking good technical questions — reproduce/report bug with redacted environment and minimal example.
- [x] `00.03.06` Reading changelogs and docs — semver compatibility and upgrade decision exercise.
- [x] `00.03.07` Experiment logs and architecture notes — ADR and repeatable hypothesis/evidence artifact.
- [x] `00.03.08` Bug Hunt: environment mismatch — capstone diagnosis and repair under different environment inputs.
- [x] Ensure *each*: MDX lesson, metadata, lab manifest, starter, solution, executable regression tests, official sources, knowledge check, rubric (source files authored; CI validation still pending).
- [x] Register all published IDs in curriculum UI, metadata, sitemap, next-lesson navigation; verify planned pages still `noindex` (implementation committed; browser verification pending).
- [x] Updated `docs/checkpoint.json` for 28 lessons / 25 MDX / 25 labs and updated human checkpoint; run `npm run checkpoint:check` in CI to confirm.
- [ ] PR checks: audit + lint + typecheck + unit + catalog + content + checkpoint + lab tests + production build + Chromium.
- [ ] Vercel preview review, merge only after green, verify new main SHA/production READY, update handoff.

## P1 — Security and reliability
- [ ] **By 2026-12-02 UTC** review GHSA-fc5q-39xc-vjpf Picomatch development dependency exception; remove promptly when compatible fix exists. Never use `npm audit fix --force` blindly.
- [ ] Check that browser code preview uses isolated origin, does not run untrusted server-side code, and remains functional on mobile.
- [ ] Improve reference source URL checks and authored-vs-planned cross-links.

## P2 — Next content after module 00.03
- [ ] Start Track `01`: HTML/Web Platform. Author **one entire module at a time** with labs and verification.
- [ ] Expand 4 drafted reference entries toward 303 indexed references using reusable syntax/parameters/errors/examples/source contracts.
- [ ] Consolidate stale README v1.1 descriptions, introduce clearer learning paths and review cycles.
- [ ] Later: authenticated sync and advanced code grading **only** after privacy, sandboxing, and costs are designed.

## Definition of done (per module)
**A published module is done only when** every catalog ID has a reviewed MDX body and strict metadata; runnable instructor solution and meaningful starter tests; route is indexed, navigation accessible, and progress honest; security audit passes; CI, production build, and Chromium pass; preview verified; merged and deployed. Document evidence and SHA in the checkpoint. Do not label a PR build as production.
