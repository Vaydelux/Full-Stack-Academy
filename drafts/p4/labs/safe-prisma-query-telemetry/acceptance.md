# 13.03.06 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Run a failed query and confirm an error count/trace is recorded without leaking values and with a stable request correlation ID.

## Required negative regression
Send fake secret and private document content through a query. Verify none appears in logs, traces, monitoring exports or exception JSON.

## Security and operational boundary
Event logging interfaces differ by Prisma version; validate the generated client and telemetry output before release. Avoid unbounded per-user identifiers as metric labels.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
