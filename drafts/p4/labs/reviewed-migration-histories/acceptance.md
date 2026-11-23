# 13.03.03 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Record migration files, checksums, target database identity and consistent schema state from a second clean test environment.

## Required negative regression
Start with a clean empty disposable database and replay the committed history; detect missing tables, altered applied migration checksums or untracked schema drift.

## Security and operational boundary
Prisma migrate deploy does not automatically certify a zero-downtime change or regenerate the client. Do not run migrate reset, db push, or migrate dev on production credentials.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
