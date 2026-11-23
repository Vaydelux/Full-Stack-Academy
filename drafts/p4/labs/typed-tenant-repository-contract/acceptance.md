# 13.03.07 — Real runtime acceptance (NOT EXECUTED)

## Positive outcome
Typecheck against generated Prisma ORM 7 client, unit-test context validation and run a two-tenant Postgres integration test through the service.

## Required negative regression
Attempt to call a read without tenant context and inspect that the service fails closed; seed beta data and prove alpha's repository cannot return it.

## Security and operational boundary
TypeScript interfaces are erased at runtime. The HTTP handler must verify identity/permission and protect actual database credentials; a caller may still forge a structural object if the boundary is misplaced.

Run with a version-pinned Prisma ORM v7 CLI, generated client and a disposable local PostgreSQL database. Check both starter failure and corrected source behavior. Do not run destructively against production, commit secrets, or claim an authoring source check constitutes passing runtime integration.
