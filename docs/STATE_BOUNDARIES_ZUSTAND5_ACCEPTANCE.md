# Track 09.04 — Zustand 5 State Boundaries and Browser Lab

**Date:** 2026-11-19 · **Branch:** `feat/zustand5-state-boundaries-live` · **Stacked base:** unmerged PR #22 at `d3180b0`, itself stacked on #21 and #20.

## Delivered source

Eight canonical 09.04 topics, **each** with MDX lesson, strict metadata, three guided steps, misconception, quiz, reflection, bug hunt, two official sources, self-assessment rubric, a deliberately broken **typed** starter, an instructor source, a real Zustand 5 Node test and a lab manifest.

- 09.04.01 local vs URL vs server state: vanilla `createStore` with typed actions
- 09.04.02 selectors/slices: real `subscribeWithSelector` and targeted subscription checks
- 09.04.03 persistence risks: `persist`, `createJSONStorage`, `partialize`, `skipHydration` and memory-backed storage test that proves `token` is not serialized
- 09.04.04 derived state: computed totals from a single array source of truth plus actual subscription checks
- 09.04.05 multi-tab coordination: revision/origin policy; explicitly notes that revision-only ordering does not solve simultaneous conflicting writes
- 09.04.06 URLSearchParams: parse and allowlist shareable filter state
- 09.04.07 duplicated-cache bug hunt: state stores only the selected ID, not remote task payload
- 09.04.08 capstone: shared `createAcademyFilterStore`, real React `useStore` with stable primitive selectors, derived catalog filtering and reset.

The browser-only route `/learn/state-boundaries-lab` is noindex and accessible from the capstone lesson. It supports search, resource type, layout density, reset, live result announcements, a safe URL-representation preview and source inspection. This page uses a distinct per-component store and no backend, persistent storage or arbitrary learner code execution.

**Source snapshot after all stacked changes:** 306 unique published IDs; 305 MDX + labs; 38 complete modules, 38 reference drafts / 303 indexed subjects; 583 of 889 planned. The next planned topic remains **09.02.01** (React Hook Form), not 09.05, because 09.02 and 09.03 are still unimplemented.

## Zustand 5-specific standards

- Official `createStore<T>()(...)` from `zustand/vanilla` and `useStore(store, selector)` for React are used, not a made-up cache API.
- Prefer a fresh store factory per independently mounted example over a request-global server singleton.
- Selector subscriptions should be to stable values. Zustand 5 can exhibit infinite React updates if a selector returns a newly allocated object on every snapshot.
- `persist` and `createJSONStorage` do not validate or encrypt persisted JSON. Use `partialize` to allowlist public preferences. Sensitive values and auth tokens must not be persisted there.
- Keep authoritative API data in server-backed query state; use Zustand for ephemeral client UI/selection and URL params for shareable filters.
- BroadcastChannel models require explicit loop prevention and conflict resolution; the local revision-only example is not a production sync engine.

Official sources: https://zustand.docs.pmnd.rs/reference/apis/create-store, https://zustand.docs.pmnd.rs/reference/hooks/use-store, https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector, https://zustand.docs.pmnd.rs/reference/middlewares/persist and https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5.

**Negative-test hardening:** All eight existing React, Next.js, UI, Zod and Zustand red-starter suites now require TAP evidence of `code: 'ERR_ASSERTION'` rather than accepting any `not ok` line. Node loader/import failures can also produce `not ok`. A new `tests/negative-gates-integrity.test.mjs` guards against this false-green condition. I verified Node's assertion output format locally, but the exact repository suites are still unexecuted.

## Source checks and release acceptance

Repository file-tree and schema audits are not equivalent to running dependencies. Run these on the EXACT branch head:

```bash
npm ci
npm run verify:offline
npm run test:red-zustand-state
```

Then start the local Next server and use isolated Chromium `scripts/browser-smoke.mjs`, including `scripts/zustand-state-smoke.mjs`. Verify 8 lesson routes, planned/noindex boundary, sitemap entries, result count when searching, per-type selection, compact density, reset, code toggle and 320px no horizontal overflow.

Manually verify keyboard navigation, screen readers, React 19 Strict Mode/hydration, browser storage privacy, and cross-tab preference conflict behavior before treating this as release qualified.

The current working container has Node 22, no clone, no npm dependency cache and cannot resolve github.com. Tests and builds were **not executed**. No Vercel or GitHub Actions used.

## Risk and next delivery

The project now has four consecutively stacked source PRs. Executable local validation and convergence to `main` are higher priority than opening more draft milestones. RHF/Query dependencies require a real lockfile update and tests; do not label those modules implemented before genuine packages and browser integration.
