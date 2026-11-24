# P6 Operations, Performance and Architecture teaching models

Run `node --test examples/p6-operations/labs.test.mjs` (30 cases) and `node --test examples/p6-operations/verify-track.test.mjs` (11 synthetic auditor regressions). On a full checkout, `npm run test:p6-operations-source` also checks actual canonical manuscript coverage and publication separation.

| Module | Model | Evidence boundary |
|---|---|---|
| 21.01 | safeLog | selected fields and route format, not comprehensive secret detection or real exporter |
| 21.02 | errorBudget | supplied event-count SLI arithmetic, not uptime monitoring |
| 21.03 | incidentDecision | illustrative severity/ownership rubric, not an incident response service |
| 22.01 | webBudget | supplied measurements, not browser instrumentation |
| 22.02 | requestProfile | per-request queue/work sample distributions, not real benchmarks |
| 22.03 | capacity | simplified throughput/headroom forecast, not actual scaling |
| 23.01 | boundaryViolations | explicit directed edges, not static analysis of an application |
| 23.02 | dependencyCycle | synthetic directed graph, not real framework module wiring |
| 23.03 | idempotentConsumer | in-memory duplicate/conflict checks, not restart durability |
| 23.04 | retryDecision | deadline and attempt decisions, not actual network retry scheduling |

All inputs are synthetic; no production credentials, live services, deployment or paid resources are required for these models. For each manuscript, perform the guided real-tool experiment in an authorized disposable environment before claiming external acceptance. In particular never feed real private data to log/profile fixtures, assume supplied strings are safe merely because a log field was allowed, or equate an in-memory idempotency map with a durable inbox.

See `docs/ACADEMY_P6_OPERATIONS_ARCHITECTURE_CHECKPOINT_20261124.md`.
