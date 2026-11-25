# F8.4 — local operational runtime vertical

This dependency-free Node 24 lab is a companion to the existing P5 and P6 models. It does not qualify every topic in the 144-lesson P6 phase. It is synthetic, local-only and not deployable production auth.

## Actual local qualification
From repository root with Node 24.11.1+ (24.x), run npm run test:p6-runtime. Nine tests were executed against real SQLite files, independent child processes and loopback sockets on Node 24.11.1. No external services or npm installation are necessary for that group. Node sqlite is experimental in this runtime. Temporary databases are removed after tests. The worker exits at explicit failpoints before COMMIT or after COMMIT before acknowledgment, without closing its DB; subsequent child processes open the same durable journal. This tests process-exit/restart behavior, not power failure, hardware durability, broker restart, cluster failover or external side effects. Never run worker.mjs on an existing application database.

- journal.mjs + worker.mjs: transactional intent, receipt and synthetic balance; duplicate payload conflicts, tenant-scoped IDs, rollback and replay.
- service.mjs: synthetic opaque bearer sessions, bounded SSE history, replay cursor and gap detection, tenant isolation, revocation/expiry, heartbeat, slow-client termination; process-local events are not a durable feed. Browser EventSource cannot attach a custom Authorization header; the exercise uses a fetch streaming client, not a browser-auth integration.
- resilience.mjs: circuit states, generation fencing for stale completions, one half-open probe, bounded exponential retry attempts and cooperative AbortSignal deadlines. Operations must honor the signal; it cannot forcibly cancel arbitrary synchronous/uncooperative code.
- telemetry.mjs: W3C-shaped trace context, selected log fields (never log headers/query/body), low-cardinality Prometheus text metrics. Counts cover completed HTTP responses only; disconnected SSE requests and active stream gauges are separate evidence.
- otlp.mjs: minimal explicit OTLP/HTTP JSON exporter, tested with an actual HTTP test receiver (not a real Collector or official OpenTelemetry SDK). No batching, retries, propagation across service dependencies or collector deployment claimed.
- load.mjs: bounded loopback requests, actual nearest-rank p95, error rate, throughput, configured pass/fail budgets. Run npm run measure:p6:loopback for a fresh synthetic local measurement, not production capacity claims.

The default service can be started via npm run serve:p6:lab, bound to numeric loopback only. The HTTP /health, /ready and /work routes demonstrate health/readiness separation and /metrics exposes the teaching histogram. Synthetic stream credentials are issued only in-process to the test harness, not to HTTP callers. Do not expose this service publicly.

## Opt-in WebSocket qualification
The independent websocket workspace pins ws 8.23.0 (npm version list checked November 25, 2026). Generate a genuine package-lock.json with npm install --package-lock-only --ignore-scripts in that directory, inspect/audit and commit it, then npm ci. Run npm run qualify:p5:websocket from root. The live test source covers real upgrades, origin and tenant rejection, authorized fanout, malformed messages, and revocation. It uses Node ws clients with synthetic bearer headers, not browser cookie authentication. No actual ws test ran here because npm registry resolution is unavailable. Keep optional dependency and lockfile separate from frontend.

## Opt-in Docker qualification
Use a disposable local Docker context; verify that it is not a remote or production daemon. Preload and inspect a trusted Node 24 image digest. Set ACADEMY_DOCKER_ISOLATED=YES and ACADEMY_NODE_IMAGE=node:24-<variant>@sha256:<actual digest> (replace placeholders). Run npm run qualify:p6:docker. The script refuses floating tags, checks local digest, builds without network, creates a unique named container with no network or ports, read-only root, no capabilities, no-new-privileges, resource limits and nonroot user. It checks actual health, readiness and uid, then removes only its random test container/image. No Docker build or smoke was run here. Never use a shared Docker context. No registry push or hosted deployment.

## References
https://opentelemetry.io/docs/specs/otlp/
https://www.w3.org/TR/trace-context/
https://prometheus.io/docs/instrumenting/exposition_formats/
https://nodejs.org/api/sqlite.html
https://www.npmjs.com/package/ws
https://docs.docker.com/engine/containers/run/

## Next work
Complete external BullMQ/PostgreSQL/Redis restart qualification, real WebSocket and Collector/container execution, browser performance/accessibility and actual database query benchmarks. Then move to P7 platform/enterprise/capstone runtime verticals, and guarded live publication projections in canonical order. This source group is mandatory in verify:offline; optional external gates remain opt-in. No deployment, production configuration or publication registry is changed.
