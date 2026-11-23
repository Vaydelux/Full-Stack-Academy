# 13.03.08 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Verify a fresh replay produces the intended schema and the migration file is checked in with known checksum and release notes.

## Required negative regression
Manually alter a disposable test table, then compare it to a database recreated only from migration files. Confirm the mismatch is detected and the repair is reviewed.

## Security and operational boundary
Never use migrate reset on production. A schema diff can suggest destructive SQL; always review data impact and migration ownership before applying.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
