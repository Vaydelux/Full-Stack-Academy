# 12.05.05 — operator evidence review (not automated)

**Manual evidence is mandatory.** The checked-in SQL examples do not demonstrate that backup, replication, security or recovery functions work end-to-end.

## Real test procedure

Using a non-superuser local test account, inspect role flags, schema/table privileges and an explicit negative test that the runtime role cannot create roles or read an unrelated schema. Record the connected role, object and SQLSTATE.

## Broken assumption

The starter prints a role name without checking whether the login is a superuser or can create roles/databases.

## Operational boundaries

SELECT from pg_roles is read-only metadata inspection, not a privilege grant or a complete access audit. Creating test roles and exercising denial paths requires an isolated DBA-controlled lab.

Use only explicitly designated, isolated PostgreSQL test resources. Record version, exact commands without passwords, expected/actual results, file/database identities, timestamps, and recovery timings where applicable. Keep any evidence containing credentials or personal data out of Git.

Reviewer status: **not executed / not verified**. Never mark this checklist complete from a source-content audit.
