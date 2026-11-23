# 13.02.06: runtime qualification NOT EXECUTED

## Real positive check
Test error mapping in isolation and trigger a duplicate unique insert in a disposable DB to verify the real driver's error code before relying on it.

## Required negative regression
Simulate P2002, P2025 and an unknown error containing a fake password. Assert the public response never contains internal fields or that password.

## Limits
A unique conflict is not a reason to echo the conflicting record or reveal another tenant's existence. Error semantics must preserve object-level privacy.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
