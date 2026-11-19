# Next TODO — Offline React Effects/Advanced Stacked Candidate

**2026-11-19:** GitHub `main` contains 181 source-authored IDs. PR #17 proposes React `06.01–06.02` with 196 IDs. A separate **stacked** branch `feat/react-effects-advanced-offline` adds 16 more lessons across `06.03–06.04` to a source total of **212 IDs, 209 MDX, 209 labs, 26 complete modules**. Neither candidate is certified for a hosted deployment.

## P0 — Complete local acceptance before merge

- [x] Author eight `06.03` lessons: purity, Effects, cleanup, dependencies, refs, focus, avoiding redundant Effects, timer/keyboard capstone
- [x] Author eight `06.04` lessons: context, custom Hooks, transitions, deferred value, optimistic state, form action state, Error Boundaries/Suspense, optimistic comments capstone
- [x] Add 16 intentionally defective starters, 16 instructor solutions, 16 local assertion suites and manifest files
- [x] Wire publication registry, metadata map, all-lab scripts, per-lab commands, browser smoke, machine checkpoint and negative starter gate
- [x] Add the local-only `npm run verify:offline` orchestrator (source-authored; has NOT been executed here)
- [ ] Run a full local clone with Node 24 and locked dependencies: `npm ci && npm run verify:offline`; stop on failure and record exact commit+runtime evidence
- [ ] Start local Next and run isolated Chromium browser smoke (no hosted environment)
- [ ] Add mounted React interaction tests for effect cleanup, actual focus, transitions, optimistic rejection and Suspense/error fallback; Node SSR/pure model tests alone do not prove these
- [ ] Fix failing or unsubstantiated lessons; qualify PR #17 first, then stacked changes; do **not** merge until the exact head is verified

## P1 — Remaining large program

- [ ] React `06.05` (8 lessons) testing/performance; genuine React Testing Library execution needs dependency/lockfile integration, or mark the relevant articles planned
- [ ] Next.js `07.01–07.05` (40 lessons) with App Router, RSC, server/client boundaries, data fetching, caching under explicit `cacheComponents` mode, auth, SEO, error/load boundaries and route-handler security labs
- [ ] Distinguish Next.js 16 Cache Components from previous cache model; never present route-segment `revalidate` and `use cache` rules as simultaneously interchangeable
- [x] Author eight additional React 19 hook quick-reference drafts and implement searchable, paged, status-filtered encyclopedia (12 drafts total)
- [ ] Expand remaining technical reference subjects (303 indexed, 291 without authored draft pages)

## P2 — Security and truthful release status

- [ ] Audit known 14 high dev-only Picomatch reports and the exception expiry (2026-12-02 UTC)
- [ ] Run manual keyboard, screen reader, reduced-motion and narrow viewport checks
- [ ] Preserve no public remote learner-code execution, no paid dependencies and browser-local self-assessed progress
- [ ] No Vercel checks and no GitHub Actions checks until the owner explicitly changes the development constraints

## Successor handoff

Start from the latest branch and read `AGENTS.md`, `docs/checkpoint.json`, `docs/REACT_EFFECTS_ADVANCED_ACCEPTANCE.md`, `docs/REACT_FOUNDATIONS_ACCEPTANCE.md` and the curriculum JSON. The next *unimplemented canonical topic* is `06.05.01`; don't change publication counts without full authored lessons and labs.
