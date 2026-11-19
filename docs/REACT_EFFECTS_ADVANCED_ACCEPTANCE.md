# React Effects and Advanced Hooks — Stacked Offline Candidate

**Date:** 2026-11-19 · **Branch:** `feat/react-effects-advanced-offline` · **Base:** PR #17 `687b1da` (not `main`).

## Authoring delivered

- `06.03.01–06.03.08`: render purity, Effects, cleanup, dependency correctness, mutable refs, focus, derived values and timer/keyboard capstone
- `06.04.01–06.04.08`: context/provider, custom Hook, transition, deferred value, optimistic value, useActionState, error boundary/Suspense and optimistic-comments capstone
- 16 unique MDX bodies, strict metadata files, 16 intentionally failing starters, 16 corrected instructor solutions, 16 local tests and strict lab manifests
- Registration in both publication registries; per-lab and aggregate scripts; negative-starter checking; source-based browser route/noindex/sitemap smoke

## Reference encyclopedia extension

Eight more **draft** API reference pages are authored for React 19 state, reducers, effects, refs, context, transitions, optimistic state and form Actions. The reference index now has a low-density, searchable/paginated/category- and publication-status-filtered explorer. New React references link to the corresponding lessons and official React docs. The authored draft count is **12 of 303 indexed subjects**, not 303 complete articles. Browser behavior is not yet tested.

## Verification actually performed versus pending

Source file generation and metadata design completed through GitHub connector. **No Node dependency installation, lint, TypeScript, MDX compilation, checked-in unit test execution, production Next build or browser smoke has been performed in this environment.**

**Shortcut after a successful locked install:** `npm run verify:offline` executes the existing lint, typecheck, repository test, content, checkpoint, all-labs, red starter checks and Next build in one local process. The script was authored but has not been executed in this session.

Local gate (must run and fix before merge):

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run verify:content
npm run checkpoint:check
npm run test:labs
npm run test:red-react
npm run test:react-red-advanced
npm run build
```

Use the existing isolated Chromium setup and local Next server for `scripts/browser-smoke.mjs` without visiting Vercel.

The tests in `06.03–06.04` primarily prove pure functions, reducer-style rules, setup/cleanup contracts using injected mocks, or initial server markup. **They do not prove effects actually run after a commit, Focus API triggers on a mounted input, transitions remain responsive under load, Suspense catches async work, errors recover in a live DOM, or optimistic rejections reconcile.** Add mounted behavior tests before release claims.

## Publication truth

- `main`: 181 source-authored lesson IDs, 178 MDX bodies/labs, 22 complete modules
- PR #17 head: 196 source-published IDs, 193 MDX bodies/labs, 24 complete modules (unmerged)
- Stacked React advanced branch: **212** source-published IDs, **209** MDX bodies/labs, **26** complete modules (unmerged)
- Canonical catalog: 889 topics; if this candidate passes, 677 remain planned
- Next unimplemented module: `06.05` (8), followed by Next.js `07.01–07.05` (40)

## Official reference policy

React Effects: https://react.dev/learn/synchronizing-with-effects; Hooks: https://react.dev/reference/react/hooks; concurrent actions: https://react.dev/reference/react/useTransition and https://react.dev/reference/react/useOptimistic. Use Next.js 16 mode-specific guidance in later modules; do not silently mix Cache Components and previous cache models.

## Non-goals

No cloud runner, remote learner code execution, authenticated backend, paid provider, automatic certification or hosted deployment. No GitHub Actions/Vercel checking or toggling.
