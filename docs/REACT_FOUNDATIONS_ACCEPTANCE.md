# React Foundations & State — Offline Acceptance (2026-11-19)

## Scope

Branch `feat/react-foundations-state-offline` follows merged `main` commit `7e8f42d`. It authors the 15 missing lessons in `06.01.02–06.02.08` and retains the existing comprehensive `06.01.01` JSX lesson.

### Modules
- `06.01` React composition: JSX sample, components/props, children, conditional rendering, stable lists, render/commit, event callbacks and profile dashboard capstone
- `06.02` React state: snapshot semantics, queued functional updates, derived totals, immutable row updates, keyed state identity, lifting state, typed reducers and stale-closure repair

### Acceptance boundaries

- Each new MDX has strict React 19 / TypeScript 5 metadata, prediction, three worked steps, quiz, bug hunt, verified-path lab manifest and official documentation links.
- Fifteen offline starter/solution pairs export the same component/model contract. The checked-in solution tests cover representative success and failure cases. Negative starter checks are wired into `npm run test:red-react`.
- SSR tests validate initial server markup; reducer/model tests validate pure state transitions. **They do not prove user-event behavior, key reconciliation after reordering, effect lifecycle or hydration.** Future DOM/browser tests must cover those separately.
- Publication registries, full lab test list, individual `lab:react-*` commands, planned lesson noindex boundary and sitemap expectations are updated.
- No remote learner-code execution, credentials, backend, paid service, Vercel check or GitHub Actions check added.

## Local verification checklist — not yet executed

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run verify:content
npm run checkpoint:check
npm run test:labs
npm run test:red-react
npm run build
```

For full browser smoke, run a locally built app in an isolated environment with the supported Chromium/Playwright installation and execute the existing `scripts/browser-smoke.mjs` contract. Also run manual keyboard, screen-reader, RTL, reduced-motion and 200% zoom checks before release.

## Honest candidate counts

- **GitHub main baseline:** 181 lesson IDs, 178 MDX lessons, 178 labs, 22 complete modules. Not a hosted deployment claim.
- **Proposed branch:** 196 lesson IDs, 193 MDX lessons, 193 labs, 24 complete modules.
- **Canonical catalog:** 889 IDs; 693 remain planned if this candidate is accepted.
- **References:** 303 indexed subjects, only four authored draft references.

## Next large-scope handoff

After qualifying this branch, author `06.03–06.05` (24 lessons) and `07.01–07.05` (40 lessons) as a 64-topic React/Next.js program with track-level acceptance. Keep features reader-first, documentation comprehensive, labs independently testable and publication counts truthful.
