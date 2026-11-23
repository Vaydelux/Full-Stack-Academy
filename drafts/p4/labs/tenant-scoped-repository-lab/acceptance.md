# 13.02.08: runtime qualification NOT EXECUTED

## Real positive check
Run an HTTP-level integration test with authenticated identities, a disposable Prisma 7 + PostgreSQL schema, forbidden/allowed reads and a raw-result secret-leak assertion.

## Required negative regression
Use one task and project from each tenant. Ask alpha's service for beta's project and assert an empty or not-found response, without leaking the project title.

## Limits
Tenant isolation is the baseline, not all authorization. Add user-to-project membership rules if not every tenant member may read every project.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
