# 13.04.01 — manual integration qualification, NOT EXECUTED

## Positive real-test case
Use a dedicated test database role to connect from Prisma 7 and fetch one synthetic tenant row without exposing any DB URL or secret to the browser.

## Required negative case
Build a Next.js client bundle with a fake database password and ensure it is absent. Attempt to import the server module in a client component; the build must reject it.

## Trust boundary
A successful SQL connection does not inherit per-user Supabase JWT/RLS context. Server request handlers must still validate actor and object permissions.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
