# 12.05.01 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

Inspect the settings and capture a real pg_basebackup/WAL archive policy on a disposable instance. Document WAL continuity, restore target timestamp, RPO/RTO and a successful separate restore; do not mistake an archive_mode setting for a passing PITR drill.

## Broken assumption

The starter looks at two settings and assumes a backup exists; it omits WAL archiving evidence, restore target, offsite retention and a completed test restore.

## Operational boundaries

Changing archive_mode or wal_level often requires a restart and is out of scope. Do not change production instance settings to perform this lesson. The learner can only qualify PITR by a genuine recovery exercise in a separate instance.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.
