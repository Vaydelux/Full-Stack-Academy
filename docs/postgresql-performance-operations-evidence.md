# PostgreSQL 12.04–12.05 consolidated evidence preparation

Status: candidate implementation, not published. The current canonical queue still begins with P1; 12.04 and 12.05 remain review-only and cannot be applied using the 12.01–12.03 guarded promoter.

## Performance
- 12.04.01: estimated-only negative control and three actual EXPLAIN (ANALYZE, BUFFERS) JSON plans.
- 12.04.05: 1, 10 and 100 parent cases, two child tasks per parent, measured client query counts, ordered result parity with both batched and joined results, JSON payload bytes (not on-wire traffic), and elapsed time.
- 12.04.07: committed updates/deletes, VACUUM outside a transaction, before/after statistics and measured duration; stats can lag.
- 12.04.08: 20 actual plans before and after a targeted index, nearest-rank p50/p95 execution durations, total index bytes and result parity. No forced plan or speedup assertion.

The synthetic dataset is 20,000 rows. Relevant server settings are captured; local machine conditions, representativeness and actual plan interpretation still need human review.

## Operations
A logical dump/restore can contribute evidence to 12.05.01, 12.05.07 and 12.05.08, but never substitutes for PITR, WAL continuity, replica replay/failure, real privilege denials, pooler compatibility/load, or restored roles/extensions/ownership. The review template now names these missing obligations separately. The six existing SQL-contract exercises across 12.04–12.05 use real red/green SQL.

## Local collection
Use a clean checkout, Node 24, genuine lockfiles, and disposable PostgreSQL 17+ with restricted roles. Install the distributed runtime dependencies with npm ci --prefix examples/p5-distributed-runtime. Configure the isolation variables in docs/postgresql-12-03-publication.md. For 12.05 use the separate backup and restore databases required by scripts/pg-restore-drill.mjs (academy_test_backup and academy_test_restore; set PG_RESTORE_TEST_URL and ACADEMY_PG_RESTORE_ISOLATED=YES). No production URLs.

1. Run npm run publish:academy -- --project 12.04 (or 12.05).
2. Use the returned external review directory with npm run publish:academy -- --collect-runtime-evidence 12.04 DIRECTORY (or 12.05).
3. The collector checks the manifest, current checkout and every projected file, runs the supported real tests, then writes distinct source-bound logs. It refuses existing artifact paths. It reports hashes but does not fill the human review or mark approval.
4. Complete genuine manual obligations, record observations, attach artifacts and fill the exported evidence.json with actual hashes. Use npm run publish:academy -- --check-review-evidence MODULE_ID DIRECTORY. That check verifies structure, artifact integrity and exact commit/topic bindings and typed results for the supported collected artifacts, not authenticity or release approval.

A separate guarded live projection/apply mechanism for these mixed-evidence modules is still required. The existing manual wrappers deliberately fail. No browser, accessibility, production recovery or deployment approval is implied. Do not commit credentials, synthetic review fixtures or operational logs containing secrets.

## Collector regression follow-up

The collector checks exact canonical topic order and supported obligation per topic, validates the complete serialized artifact using the same typed validator as review checking before writing, and uses exclusive file creation with cleanup on caught write/postflight failures. Eight tests exercise the real temporary filesystem with injected SQL/runtime results (13 synthetic artifacts, not actual database evidence). Collision and checkout-drift failures preserve pre-existing evidence. A symlinked artifact directory is refused. Use a private external directory with one writer; process-crash recovery and hostile concurrent filesystem mutation are not covered. Manual obligations and publication gates remain unchanged.
