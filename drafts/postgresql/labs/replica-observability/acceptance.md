# 12.05.02 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

On two disposable configured PostgreSQL servers, record primary and standby roles, sender/receiver status, WAL positions, observed replay lag and recovery behavior after an intentional safe failure.

## Broken assumption

The starter checks whether the local server is in recovery but does not inspect sender/receiver status or whether a replica is actually caught up.

## Operational boundaries

An empty pg_stat_replication result on a standalone test server is not evidence of healthy replication. This module cannot auto-create a second PostgreSQL instance or prove failover safety.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.
