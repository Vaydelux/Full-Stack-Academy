# F1 — merged editorial baseline and partial runtime qualification

Date: 2026-11-25

## Baseline

PR #72 was merged by explicit owner request at `08a53a2c9a0b6c6b0a526695d7c998a49671b8a0`. GitHub reported zero open pull requests and zero feature-branch commits ahead of main immediately afterward. The editorial scope is frozen at 28 tracks, 111 modules, 889 canonical topics. 338 unique published topics and 551 unpublished expanded manuscripts; merge is not publication or production approval. No changes to live lesson registries, dependency locks, Vercel configuration or GitHub Actions definitions.

## Executed checks

A full checkout was not available. Six exact text files were reconstructed in an isolated temporary directory from the merged GitHub commit. Each local Git blob hash matched the remote blob identifier before executing tests.

| File | Git blob |
|---|---|
| scripts/curriculum-scope-freeze.mjs | 092b51ea34a9300d6a62379786d3bda2c98a7e87 |
| tests/curriculum-scope-freeze.test.mjs | 4102f71da2cfb878331d8f311a844ce8561ecf57 |
| scripts/staged-inventory.mjs | 24ce92cdba3651bbf9f4882d9a9206633af42e45 |
| tests/staged-inventory.test.mjs | b90d8dcfe4a4b63cf2700ffb48c530a699a99e54 |
| scripts/forms-query-browser-navigation.mjs | bef10e78fe405d2d6140b1facc5112f93af8e8d7 |
| tests/forms-query-browser-navigation.test.mjs | 92cf27254ea911bb3a30f8443ef973c8138b1c5e |

Executed `node --test tests/*.test.mjs` inside the isolated reconstruction. Node 22.16.0: 23/23 scope and inventory tests passed. Subsequently located Node 24.11.1 bundled with installed Python Playwright driver; invoked that actual Node executable, and npm CLI 10.9.2 reported its version under Node24. Node24 results: 33/33 passed, zero failures/skips (12 scope, 11 staged inventory, 10 P1 browser-navigation classifier). Classifier tests are not real DOM acceptance. These counts are for the reconstructed subset, not the complete curriculum-readiness or P1 suite.

## Environment verification

- Node 24.11.1 executable exists for isolated execution; default shell still Node22.
- `git ls-remote` for this repository failed DNS resolution; `getent hosts github.com registry.npmjs.org nodejs.org` returned no addresses. Full clone and npm dependency installation were not performed. Root and nested Forms/Query lockfiles are present in merged Git tree; Nest example lock is absent.
- Chromium 144.0.7559.96 launched through the installed Playwright Python package, but navigation to a self-created synthetic loopback page failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. No DOM interaction executed. This policy was not bypassed. The Academy browser gates remain not-run.
- PostgreSQL and Docker executables unavailable. FFmpeg installed but no media exercise executed.
- Full Next/MDX build, actual RHF/Query browser tests, live databases, provider/device integration and manual accessibility review remain not-run. No publication approval.

## Next concrete action

Use an approved networked workstation or execution environment with a clean Git checkout, Node24.9+ stable, npm registry access, installed Playwright and permitted local HTTP. Follow `docs/ACADEMY_LOCAL_QUALIFICATION_CHECKPOINT_20261124.md`. Start independently with the P1 profile, which does not need the missing Nest lock:

```powershell
git switch main
git pull --ff-only
npm run qualify:academy:local -- --plan-p1
# Only after prerequisites are clear:
npm run qualify:academy:local -- --run-p1
```

The existing runner performs the actual installs, builds and scripted checks. Retain the exact receipt and conduct the named human reviews. Do not approve or apply promotion until every applicable gate passes. Then qualify 09.02 and 09.03 in order, target 354 unique published lessons. Generate the real Nest lock with approved registry access before the all-profile. Do not change the frozen scope or fabricate evidence.

This report records the observed environment and isolated test results only. It is not a signed qualification receipt.
