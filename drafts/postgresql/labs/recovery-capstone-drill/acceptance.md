# 12.05.08 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

Use the module's restore-drill runbook to create a dedicated persistent sample schema on a local test database, dump it, restore to academy_test_restore, verify row counts and checksum, collect errors and elapsed duration, and document clean-up.

## Broken assumption

The starter can display live rows but has no evidence that any backup was created or that the rows would survive a database loss.

## Operational boundaries

Never use production credentials or destructive `--clean` against an existing environment. The runbook is deliberately manual and cannot be auto-certified by a source scan or a backup filename.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.
