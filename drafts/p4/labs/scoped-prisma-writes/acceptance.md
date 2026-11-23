# 13.02.03: runtime qualification NOT EXECUTED

## Real positive check
Use a disposable two-tenant database to verify allowed, forbidden and no-op writes; test resulting database rows, not only HTTP 200/404 codes.

## Required negative regression
Try to rename beta's task while authenticated as alpha. Assert count zero and unchanged title. Also test too-short titles and a nonexistent ID.

## Limits
Even a tenant-matched update may violate finer-grained project membership rules. The complete policy belongs in domain authorization, not merely a tenant filter.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
