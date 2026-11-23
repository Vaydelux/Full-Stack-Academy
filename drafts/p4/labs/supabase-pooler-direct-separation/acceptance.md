# 13.04.02 — manual integration qualification, NOT EXECUTED

## Positive real-test case
Run a read through the runtime pool and an approved migration on an isolated direct test endpoint. Record TLS, connection counts and prepared statement behavior.

## Required negative case
Attempt a migration with an intentionally inappropriate test pooler configuration; confirm the qualification records the failure without trying production.

## Trust boundary
Pooler modes and endpoint availability vary by project and plan. Verify current Supabase docs and live connection strings instead of hardcoding a provider host or port.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
