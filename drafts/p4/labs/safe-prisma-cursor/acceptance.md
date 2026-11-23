# 13.02.05: runtime qualification NOT EXECUTED

## Real positive check
Seed at least two tenants with identical timestamps. Test empty, first, middle, final and invalid cursor pages, with no duplicate or skipped IDs for an unchanged dataset.

## Required negative regression
Pass a cursor from beta while requesting alpha: reject it rather than disclosing a cross-tenant position. Reuse a cursor after adding new rows and inspect stability.

## Limits
Keyset pagination is not a snapshot: deletions, mutable sort keys and authorization changes can still change what later pages return. Define cursor semantics.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
