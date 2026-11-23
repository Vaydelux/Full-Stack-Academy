# 13.04.03 — manual integration qualification, NOT EXECUTED

## Positive real-test case
With local Auth users alpha and beta, each sees only their own row through the same API and role configuration.

## Required negative case
As alpha, read beta's notes by known ID via the Data API. Expect zero rows. As a direct privileged SQL role, demonstrate why a separate server authorization check is essential.

## Trust boundary
SELECT policies do not secure INSERT/UPDATE/DELETE. Verify WITH CHECK and authenticated identity. SECURITY DEFINER and service roles may bypass normal RLS.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
