# 13.03.04 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Replay the migration sequence from the previous schema in a disposable PostgreSQL database and compare the old/new reader behavior.

## Required negative regression
Seed old-version rows, run the starter and record a failure or deployment-incompatibility. For the instructor, verify backfilled rows and explicit NOT NULL metadata.

## Security and operational boundary
The example's one-shot UPDATE is for tiny synthetic data only. Large production backfills need batching, observability, timeouts, lock review and potentially online validation.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
