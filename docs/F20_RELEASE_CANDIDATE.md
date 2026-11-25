# F20 — Release candidate handoff (not qualified)

Feature/content expansion is frozen. The candidate stays on the existing draft PR. The canonical curriculum and publication counts are unchanged: 889 topics, 338 published lessons, 551 reading editions, 303 authored reference drafts and 337 published lab fixtures. A reading edition is not a certified lab.

## Local qualification

Use a clean, trusted full checkout at the reviewed commit, Node 24.9+ stable, npm and a separately installed Playwright environment with Chromium. Set ACADEMY_BROWSER_ROOT to the absolute directory containing that package. Invoke:

```sh
npm run qualify:academy:local -- --plan-release
npm run qualify:academy:local -- --run-release
```

The release profile requires the full F18 source audit, dependency audit, existing academy/P1 full qualification (including the 80-step offline matrix and production build), RHF and Query browser gates, Nest runtime, reading browser, F17 responsive search browser and new F20 production-boundary browser checks. The profile fails closed on missing scripts, checkout/lock changes, errors, nonzero exits and timeouts. Receipt is written outside the repository. Legacy all/P1 profiles remain compatible. Even automated-passed never grants publication or deployment approval.

F17 and F20 browser commands now start and close a loopback production Next server. F20 smoke verifies headers, noindex and reading credit isolation, successful note persistence and corrupt-storage preservation with the dashboard warning. The root syntax gate covers academy .mjs files; compiler-resolution regression includes F17/F19 helper imports instead of stale fixed count.

## Required before merging/deploying

- Actual full audit and complete locked build, lint, typecheck, all scripted tests and browser checks; fix real failures, repeat clean commit qualification.
- Review dependency audit on current data; historical dev-only exception expires 2026-12-02. No assertion of current vulnerability count.
- Manual keyboard, screen reader, zoom/contrast and device review; record reviewer and exact candidate.
- Phase-specific actual service/editorial evidence for publication; ordered next remains 09.02, no count change.
- Review candidate commit and deployment permissions, confirm preview commit, routes/headers and browser checks; deploy only with approval and known rollback target. The local coordinator cannot approve or deploy.

## Actual environment

The local shell reports Node v22.16.0/npm 10.9.2 and git ls-remote fails DNS resolution of github.com. No full checkout, Node24 build, browser, dependency audit, publication or deployment was performed in this milestone. The release profile is implemented, not a successful qualification receipt.
