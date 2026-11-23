# 13.02.01: runtime qualification NOT EXECUTED

## Real positive check
Run both positive and forbidden reads through an authenticated API with a real generated client and least-privileged connection; assert response shape and tenant isolation.

## Required negative regression
Using two seeded tenants, request beta's task ID from alpha's authenticated route and expect null/404 without revealing task existence or owner metadata.

## Limits
The Prisma Client type system does not enforce BOLA prevention. Treat a client-provided tenantId or JWT user_metadata as untrusted unless the server verified it.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
