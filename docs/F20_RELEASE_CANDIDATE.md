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

## Actual evidence and blocked state

- Verified committed Git tree (not truncated): 889 topics, 338 published IDs, 551 unpublished manuscript IDs, zero missing manuscripts, 303 unique authored reference IDs with zero missing index IDs, and 337 published lab manifests. Verified main remains at `7473957930424f3c21a3f983093099c71ea509db` during this check. This is not a production-deployment SHA verification.
- 38 coordinator and release-wiring test bodies passed in the connector JavaScript runtime (six filesystem-dependent bodies skipped). These include all three new pure release-profile tests and four F20 wiring tests. No actual framework runtime is implied.
- The coordinator was reconstructed locally with exact Git blob SHA `c51af6a9e46ed101dc745c476bcfa628f353ddf6`. Node 22.16.0 syntax check passed. Five separate real Node checks passed against a temporary synthetic Git repository: CLI release plan, blocked-run external receipt, actual dirty checkout detection, injected source-gate failure propagation, and legacy P1 CLI plan. The test fixture contained synthetic lockfiles and did not execute academy qualification. The local partial reconstruction also explicitly reports blocked preflight; never use this as a candidate receipt.
- Root and Forms/Query lockfiles are tracked; `examples/nestjs-vertical/package-lock.json` is genuinely absent. Both github.com and registry.npmjs.org fail local name resolution, and no npm cache is available. Generate the real Nest lock with Node 24.9+ on a trusted networked checkout: `npm install --package-lock-only --prefix examples/nestjs-vertical`, inspect the resolved versions and integrity, run `npm run qualify:nestjs:architecture`, and commit the genuine lockfile/corrections before the release profile. If the declared version cannot resolve, review version compatibility rather than faking integrity metadata.
- Browser tests remain authored, not executed. The note reload assertion now waits for hydration instead of racing it. No current dependency advisory result, full source audit, application build, browser acceptance, reviewer approval, publication or hosted deployment is claimed.

**Release verdict: BLOCKED.** The candidate is feature-frozen; the next work is resolving genuine qualification failures, not F21 feature expansion. PR #73 remains draft and unmerged. Retain existing production until a verified release is approved.

## F20.1 — Independent dependency audit coverage

The release-only profile now has ten gates. Before expensive runtime qualification it audits the two independently installed teaching workspaces (Forms/Query and NestJS) with both runtime and all-dependency scopes. No nested high/critical exceptions are granted; unavailable registry, malformed or inconsistent audit data, missing npm v3 locks and nonzero unexpected exits fail closed. Legacy all/P1 profiles and root audit policy remain unchanged. Five real local Node 22.16.0 regression tests passed with injected audit responses and synthetic locks; no actual registry vulnerability query or full release run was performed. The full checkout still fails DNS, the genuine Nest lock is absent, Node24 and browser qualification remain unverified. No publication or deployment change.

## F20.2 — Exhaustive route qualification

Reading qualification now first checks every canonical lesson and reference HTTP document on the local production server, with bounded concurrency, per-request deadlines, no redirects, HTML shell and heading checks. Existing representative browser checks remain mandatory. The reading gate timeout is extended to accommodate the exhaustive inventory. This is implemented, not executed against the production build; registry and checkout DNS remain blocked. No publication approval.
