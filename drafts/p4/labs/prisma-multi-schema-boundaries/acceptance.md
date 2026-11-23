# 13.03.05 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Generate Prisma client and migrations, inspect physical schema names and server role grants against an isolated test DB.

## Required negative regression
Connect as the public API role and attempt to read audit.AuditEvent. Expect a privilege/exposure denial while the dedicated audit service role can access it.

## Security and operational boundary
A PostgreSQL schema name or Prisma @@schema does not itself provide access control. Misconfigured grants, SECURITY DEFINER functions and privileged Prisma roles can still leak data.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
