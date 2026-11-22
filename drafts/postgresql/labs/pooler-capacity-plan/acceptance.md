# 12.05.06 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

Document the number of app replicas, per-process pools, pooler mode, backend connection budget and load-test traces. Verify session features (temporary tables, LISTEN, prepared statements, advisory locks) against the chosen pooling mode.

## Broken assumption

The starter reads a ceiling but ignores reserved connections and currently observed usage across workers and replicas.

## Operational boundaries

A settings SELECT cannot establish PgBouncer configuration or throughput. Do not assume transaction pooling preserves session state. Pooler testing needs a separate running pooler and load generator.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.
