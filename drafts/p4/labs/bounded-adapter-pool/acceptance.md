# 13.03.02 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Measure active connections, pool wait time, errors and disconnect behavior on a disposable PostgreSQL instance.

## Required negative regression
Simulate 20 requests and confirm they reuse one process-level client rather than instantiate 20 pools. Evaluate 10 replicas × pool size against a real test server limit.

## Security and operational boundary
This pool max is illustrative, not a universally safe production value. PgBouncer transaction pooling can change session assumptions; verify prepared statements and TLS with the selected pooler.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
