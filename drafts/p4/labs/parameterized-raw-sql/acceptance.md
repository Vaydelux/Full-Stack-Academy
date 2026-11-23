# 13.03.01 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Compare returned IDs to a known two-tenant fixture and inspect database logs for parameterized SQL without secret values.

## Required negative regression
Send a value resembling SQL injection, an apostrophe-containing title, an empty search term and another tenant's matching title. No injected SQL may execute or cross-tenant row appear.

## Security and operational boundary
A tagged SQL value placeholder cannot safely parameterize a table or column identifier. Dynamic identifiers require a strict server allowlist; never interpolate caller-controlled SQL fragments.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
