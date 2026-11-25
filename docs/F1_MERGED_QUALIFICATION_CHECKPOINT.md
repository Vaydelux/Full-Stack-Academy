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

## F1/P1 HTTP lifecycle qualification continuation — 2026-11-25

Baseline 3e5bb64789ef2cf2ec1025c8eaee073dd4b2c072. Direct clone still fails DNS. Reconstructed task-api.mjs (Git blob 211ebbca6c96898624f672f53d37b21240ca8446), task-client.mjs (c5901af6bd300d31ed84f119541487eb31a1296c) and existing HTTP test (be752c02772c4700783f267362d300b1b08e0a06) byte-exact. Suspected inherited static-map route bug disproved: /toString, /constructor and /__proto__ all 404. Actual repeated start/close leaked three error listeners after three cycles; failed start also leaked listening callbacks. New tests failed against original source. Fixed cleanup on successful listening, asynchronous error and synchronous listen throw; no request contract or curriculum change. The initial test expected zero listening listeners, corrected to one Node HTTP internal setupConnectionsTracking listener after direct inspection. On Node24.11.1, 36/36 isolated tests passed after fix (33 prior plus three new real socket regressions). Added 20 existing real HTTP cases for 56/56 executed tests using `node --test --test-skip-pattern='local page is served|browser modules and stylesheet' tests/*.test.mjs` in the isolated reconstruction; two static asset cases excluded by filter because source assets were not reconstructed. Initial attempted name filter did not exclude those cases and they failed on missing assets; no full static suite pass claimed. New source blob 07bbe907a20a59c10c0ec397db6d4214c5e1641c, test blob 39b96b779852cb27739ca1f1ed30bfb1936debd1. Integrated new test into existing HTTP, resilience/offline and P1 source/full qualification commands. Full Node24 checkout, npm dependencies, typed client, actual React/Next browser and manual review not run. No publishing, deployment or workflow changes.

## F1/P1 typed-client runtime continuation — 2026-11-25

Baseline 98c500a79948b17b9eaab467be80c7908a84c97b. Default Node22.16.0; bundled Node24.11.1 confirmed, GitHub DNS clone still fails. Reconstructed exact api.ts (ed76c91f30f870194b4e098623006630a17dcecb), policy.ts (16985f2c368e0f3379023699a5e4175ac921af97), existing cancellation tests (10d19fdd26f3adf4d348b1fe78e9cbcd8cc3b11f), policy tests (4ee76268995b5c8d9b15e7096772ac4f5528473f), response-contract tests (8b2e8f55a5ba7d84ea5f4741fbc6b4655c9be2ff), real HTTP client tests (82039d72c65f8b30b1e3a3f931b78174108f9b38), and repaired server (07bbe907a20a59c10c0ec397db6d4214c5e1641c); verified local Git blob hashes. The error-body JSON catch previously swallowed cancellation after 503/429 headers. New real loopback regression suite initially failed 2 of 3 cases; after fix all 3 pass, including normal malformed 409 error preserving status. Preserve signal reason and AbortError without introducing a retry, while retaining known HTTP status for malformed optional problem JSON. Tested candidate api.ts blob 360acc82526fe252b9e24e12829fd84e6aa90608 and regression blob 31aa20a18c1a869694c926c6d5d4c3d8bc7d55be. Existing API error semantics and same-key create behavior preserved.

Actual Node24.11.1 `node --test tests/forms-query-{react-api,policy,cancellation,response-contract,error-body-cancellation}.test.mjs` (shell brace expansion) returned 57 pass, 0 fail. Actual combined `node --test --test-skip-pattern='local page is served|browser modules and stylesheet' tests/*.test.mjs` returned 113 pass, 0 fail; two static-asset cases excluded from execution by filter (not available in reconstruction). New regression wired into existing typed-client package command and P1 source/full command. Full TypeScript typecheck, actual RHF/TanStack React component execution, Next/MDX, browser and named manual accessibility reviews still not-run. No registry, lockfile, deployment, workflow or curriculum changes. Not a release receipt.

## F1/P1 HTTP, resilience, workflow and native event qualification — 2026-11-25

Baseline d6a2a2715fcea02f774916ba68aeb4d0eb398a9d. Actual local Node24.11.1 binary, direct GitHub clone failed DNS again; registry DNS unresolved and npm cache empty. Restored exact committed assets (index.html 888e06efbaa4fc5b71019d789e3e939e63a9a809, styles.css 781a3367fb58883bfb3fc7c66beab4646a824344, browser.mjs cd34eb3514c50f9ebb1a4197acc47e3e208f3407) and exact resilience/workflow/native tests (844beb979022647ab5f32ccf2947206d11032f03, 753a1fe6307f2bb4f6683b567b351c69d409fc4f, 14bb625928864af1985f8bb641f4a82c3f6ca79b). Existing resilience 20/20, workflow 29/29, native event 9/9. Reconstructed combined 164/164 before native event suite, including both previously excluded static-asset checks. Native event harness is simulated DOM with actual Node HTTP, not actual browser acceptance.

Reproduced two existing native UI defects: confirmed PATCH/DELETE followed by GET failure overwrote refresh error with a misleading full-success message. Added two regression cases, both failed before repair. Native load now returns true only on successful current page application; after confirmed write, failed refresh explicitly reports stale list and error state, successful refresh retains normal message. Tests also exercise explicit recovery. Both regressions and existing native tests pass. Tested browser.mjs blob 5b5ba1ca58a3993875651de2f6f1d515a319253c, native-ui test blob c28a9cfc734866426f0710a638a7ffcb6bf0caef. New tests automatically run through existing native UI qualification command. Node --check passed both files. Combined actual `node --test tests/*.test.mjs` from isolated reconstruction: 175 passed, zero failed/skipped. All 21 unchanged reconstructed blobs matched baseline and two edited blobs matched committed candidate; no full checkout claim. No full TypeScript/RHF/TanStack/Next/MDX, actual Chromium or human accessibility run. Existing administrator policy remains a blocker; not bypassed. No publication, scope, dependency, deployment or workflow changes.
