# 13.04.04 — manual integration qualification, NOT EXECUTED

## Positive real-test case
Prove SELECT/INSERT/UPDATE on the approved table under the actual runtime login, and confirm role flags are non-superuser/non-bypass.

## Required negative case
Under the restricted role, try CREATE ROLE and SELECT from a private audit table. Both must be denied even though normal task reads work.

## Trust boundary
This snippet is illustrative and not a complete runtime-login provisioning script. PostgreSQL default privileges, sequence grants and table ownership must be separately reviewed.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
