# 13.04.06 — manual integration qualification, NOT EXECUTED

## Positive real-test case
On a disposable local project, replay the chosen migration histories and verify RLS, indexes, constraints and generated ORM client agree.

## Required negative case
Rebuild a clean local stack solely from committed histories; fail if its schema differs from the expected test schema or an owner edits the other's table.

## Trust boundary
Neither migrate deploy nor supabase db push is safe to call blindly against production. Current CLI versions, migration locks and rollback/forward-fix plans need independent review.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
