# F2 — P1 transition and local review handoff

Baseline: 49e7e3a0850634f827a73aebdfd95401454fbdbc. Scope frozen at 889 canonical lessons; 338 published. No registry, lock, Actions or Vercel change.

## Changes and evidence

Three hardcoded planned-route assertions in full browser smoke would block legitimate publication transitions. Both P1 module states now derive from live metadata, rejecting partial or reversed publication. Responsive smoke adds indexability, completion gates, quiz persistence, and retired draft-route checks. Both P1 promoters now support --review in a clean detached linked worktree, using the same projection, preflight, real build and browser postflight. No fixture is an approval; apply still requires tracked regular review evidence and the full offline gate. Both modes reject hidden Git index flags, HEAD drift and unexpected postflight changes.

Eight isolated tests actually passed on Node 24.11.1: simulated route assertions and real temporary Git repositories/worktrees. No actual Next/browser acceptance was executed. Direct git ls-remote and npm view failed DNS. No genuine Nest lock generated.

## Approved workstation workflow

Use Node 24.9+ stable, a clean main, approved registry access, installed isolated Playwright in absolute ACADEMY_BROWSER_ROOT and permitted loopback browser.

1. Run npm run qualify:academy:local -- --plan-p1, then --run-p1. Retain the actual receipt.
2. Run npm run promote:forms-query:rhf -- --plan. Create a new detached linked worktree with git worktree add --detach ../academy-review-rhf HEAD. From that worktree run npm run promote:forms-query:rhf -- --review. Serve only on loopback with npm run start -- --hostname 127.0.0.1 and manually review all eight projected lessons. Never commit or deploy the fixture. Discard the disposable worktree after review.
3. Record genuine observations in docs/release-evidence/forms-query-09.02-accessibility.json using the printed review fingerprint on the original checkout. Commit only genuine evidence. Run npm run promote:forms-query:rhf -- --apply on clean main. Inspect resulting local changes and commit only on real success. Target 346.
4. Repeat for npm run promote:forms-query:query -- --review and --apply after RHF publication. Target 354.
5. Generate the Nest lock on approved networked Node24 with npm install --package-lock-only --ignore-scripts --prefix examples/nestjs-vertical; inspect and validate with node examples/nestjs-vertical/scripts/require-lock.mjs; run npm ci --prefix examples/nestjs-vertical. Commit only genuine npm-generated lock. Qualify all four Nest modules with npm run qualify:nestjs:module -- --run 11.01 (repeat 11.02, 11.03, 11.04). The domain module requires isolated PostgreSQL, advanced requires real Socket.IO. Then use existing guarded Nest review/apply. Target 386.

No automatic commit, deployment or human review approval. Preserve scope and Vercel freeze. Abrupt interruption requires inspecting or discarding the worktree; caught failures restore projected files and checkpoint.
