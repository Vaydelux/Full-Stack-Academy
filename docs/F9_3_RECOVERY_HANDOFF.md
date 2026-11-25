# F9.3 — Crash-recoverable publication and extended PostgreSQL acceptance

Baseline 675f8b6f87a5978a6d025f379928173060537a83. No published lessons, live registries, workflows, checkpoint snapshot or deployment changed. 338/889 remains the published count.

## Publication crash recovery
The 12.01/12.02 promotion command now creates a bounded, exclusive journal in the actual worktree Git administrative directory. It records exact pre/post bytes and SHA-256 digests, repository/worktree identity, HEAD, index digest and owner PID. Each candidate file is written to a sibling temporary file, synced, and renamed over its destination. The checkpoint is predicted before writes and independently validated with checkpoint:check; no separate checkpoint mutation during postflight. On a normal failure the transaction restores exact prior bytes and removes new files. On abrupt Node exit, stop all associated qualification subprocesses, retain original HEAD/index, and run:

    npm run promote:postgresql -- --recover

Do not run simultaneous recovery or edit the checkout while recovering. The command refuses a live owner, different HEAD/index or any unexpected current file contents, and does not overwrite divergent edits. Recovery returns to the pre-promotion state, never grants publication approval. A journal interrupted during its initial creation can be incomplete; no projection starts until it is written and synced, but manual inspection is required before removing an unreadable journal. Power-loss/filesystem guarantees and Windows directory durability are not proven. The journal is not a signed record or a defense against a malicious local writer; it does not roll back unrelated tool side effects or database operations. Use a disposable worktree. Empty directories may remain after recovery.

## Extended topic qualification
Existing single-session SQL semantic checks remain mandatory. The independent live service runner uses the dedicated academy_test_distributed database and a genuine installed distributed workspace lock (see examples/p5-distributed-runtime/README.md). Run:

    npm run qualify:postgresql:extended -- all
    npm run qualify:postgresql:extended -- 12.03.02

Eight 12.03 cases: atomic transfer visibility, separate row claims and actual deadlock SQLSTATE, repeatable-read snapshot, optimistic version race, receipt/effect rollback and replay, unique-key race, failed transfer boundary, and deliberate lost update versus atomic increment.

Four 12.04 cases: three actual EXPLAIN ANALYZE BUFFERS plans on 20,000 synthetic rows; N+1 versus batch with result parity and measured query counts; VACUUM ANALYZE with recorded stats (async stats may lag); three baseline and three indexed query plans with result parity. No forced plan shape, speedup or capacity claim. The output is observed JSON when a real service is present; human performance interpretation remains required. These cases supplement, not replace, the exact red/green topic contracts. No additional live projection or promotion is enabled for 12.03–12.05.

## Separate logical recovery drill
Provision two disposable local PostgreSQL 17+ databases academy_test_backup and academy_test_restore, using non-elevated dedicated roles with CREATE SCHEMA permission and no privileged memberships. Do not use tunnels, shared databases or live data. Set ACADEMY_ISOLATED_PG=YES, ACADEMY_PG_RESTORE_ISOLATED=YES, PG_TEST_URL (backup), PG_RESTORE_TEST_URL (restore), and install compatible psql/pg_dump/pg_restore. Then run:

    npm run qualify:postgresql:restore

The drill creates a fresh UUID schema of three synthetic rows in the source, performs a custom-format dump restricted to that schema, checks SHA-256 and rejects changed archive bytes, restores into the separately named target with a single transaction and no owner/ACL replay, compares sorted actual rows and content SHA-256, and records timings and versions. It drops only the generated schemas after normal execution and deletes the temporary archive. An abrupt kill may leave the generated schema/archive; discard the entire disposable environment if unsure. This is a partial exercise for 12.05.01/07/08, not proof of PITR, replica behavior, role/extension compatibility, pooler operation, disaster recovery objectives, or real production restore.

## Verification
Five real filesystem/journal tests (including actual independent Node child exit), three isolated topic/plan source tests (live imports stubbed, not called), and two restore guard/archive tests (synthetic archive bytes, existing connection helper reconstructed) passed on Node 24.11.1. No database or browser was available; no actual pg_dump, pg_restore, plan, SQL or end-to-end CLI executed. All new tests are integrated into existing mandatory source groups. Full checkout/build and actual services remain blocking. Next: real local service qualification, remaining P3 projection contracts including manual evidence, then ordered publication starting with P1 09.02. Do not expand curriculum breadth.
