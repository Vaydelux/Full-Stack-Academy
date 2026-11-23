# 13.02.04: runtime qualification NOT EXECUTED

## Real positive check
Run against a local Postgres test database. Verify rollback after failure and a two-client concurrent transfer test with actual transaction isolation settings.

## Required negative regression
Try a missing destination and insufficient source balance; assert no debit committed. Repeat overlapping transfers on separate connections before claiming concurrency safety.

## Limits
A database transaction cannot atomically commit an external message broker or payment provider. Use an outbox and idempotency policy for cross-system work.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
