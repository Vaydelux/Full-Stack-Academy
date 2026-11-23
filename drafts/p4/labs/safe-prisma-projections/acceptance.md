# 13.02.02: runtime qualification NOT EXECUTED

## Real positive check
Execute the query with real relations and inspect JSON output. Add a regression test that fails when an internal owner field appears after a schema migration.

## Required negative regression
Insert a synthetic owner with a passwordHash and an internalRole. Assert both keys are absent from the serialized response for every task.

## Limits
A safe projection avoids oversharing but does not grant access to the selected row; combine projection with RLS or server-side object authorization.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
