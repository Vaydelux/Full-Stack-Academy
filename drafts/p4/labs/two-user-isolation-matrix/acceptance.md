# 13.04.07 — manual integration qualification, NOT EXECUTED

## Positive real-test case
Verify all permitted single-tenant CRUD requests still succeed and produce bounded safe response objects.

## Required negative case
Attempt forbidden SELECT, INSERT tenant reassignment, UPDATE ownership change and DELETE; assert access denied and unchanged rows.

## Trust boundary
A mocked JWT is not equivalent to Supabase Auth. Run the final matrix against a disposable local Supabase stack and a real Prisma adapter in the actual application stack.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
