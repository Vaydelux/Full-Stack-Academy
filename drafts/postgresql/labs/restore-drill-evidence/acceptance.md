# 12.05.07 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

Create a non-temporary sample table in a disposable academy_test database, perform pg_dump -Fc, restore into a new database named academy_test_restore, compare deterministic hashes and role/extension compatibility, then destroy the disposable target.

## Broken assumption

The starter records only row count from the original database and never tests recovery into an isolated target.

## Operational boundaries

The temporary fixture used for source examples is intentionally not a valid pg_dump restore artifact. A real restore drill requires two dedicated, non-production databases and manual authorization; the source scanner cannot certify it.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.

## Backup integrity evidence

The SQL MD5 value in the manuscript is a toy content comparison, not security-grade backup authentication. Record a SHA-256 digest of the disposable backup file, verify it before restore, and reconcile application-level data and ownership after restoring. A matching digest does not prove the restored database is usable without executing the recovery drill.
