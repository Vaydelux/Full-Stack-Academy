# F10.1 — Actual P1 HTTP qualification and lifecycle repair

Baseline c24535dd558afb362222ea5a6e8eb61e3d7a8465. No lesson, registry, checkpoint snapshot, deployment configuration or workflow changed. Published remains 338/889.

## Actual failures reproduced
On Node 24.11.1, the original byte-matched task-api.mjs let close() return before a pending listen completed, leaving the listener active. A real TCP client sending an incomplete valid POST body caused close() to remain pending until the socket was explicitly destroyed. Both were reproduced on the original source, not mocks.

## Fix
The API tracks pending startup and shutdown promises. Duplicate startup is rejected with a stable code, startup during shutdown is rejected, close waits for an in-progress listen, and simultaneous close calls share completion. Once server.close() stops accepting new connections, closeAllConnections() ends remaining HTTP connections. This is forced shutdown for a disposable educational fixture, not a production graceful-drain or transaction guarantee. The API object retains existing in-memory tasks and receipts across stop/start; no persistence across process restart is implied.

## Actual verification
The exact original API blob was 07bbe907a20a59c10c0ec397db6d4214c5e1641c. The unmodified native browser/client/HTML/CSS assets and three existing test files were reproduced byte-for-byte and their Git hashes checked against the baseline. The changed API and four new test cases were executed under Node 24.11.1 in an isolated source subset with real loopback HTTP/TCP, not a complete clone.

Command: node --test tests/forms-query-http.test.mjs tests/forms-query-resilience.test.mjs tests/forms-query-listener-lifecycle.test.mjs tests/forms-query-shutdown.test.mjs

49 passed, 0 failed, 0 skipped. This includes the prior 22 HTTP, 20 resilience and 3 lifecycle cases plus 4 new shutdown tests: repeated close during startup, duplicate start, failed bind with concurrent close, actual partial body disconnect and no unintended create. It covers server behavior, not React, TanStack Query, RHF or full Academy qualification. New tests are included in test:forms-query-http, test:forms-query-resilience and qualify:forms-query:source/full.

## Blockers and next action
The environment could not resolve github.com for a complete Git checkout. Node 24.11.1 was available through the installed Playwright runtime; default node was 22.16.0. Local Chromium was available, but a direct navigation attempt to the native loopback lab returned ERR_BLOCKED_BY_ADMINISTRATOR. Do not circumvent this policy or count launch as a pass. Root and forms/query locks exist in Git; the genuine Nest workspace lock is still missing. No actual npm ci, full build, database tests, human review or P1 promotion performed. The next action on a networked workstation remains npm run qualify:academy:local -- --run-p1, followed by the existing guarded RHF review and apply, then Query. Do not expand scope or create additional projection infrastructure solely to avoid real qualification.
