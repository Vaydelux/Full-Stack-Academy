# 13.04.08 — manual integration qualification, NOT EXECUTED

## Positive real-test case
Alpha retrieves its own document; database and API logs show only approved fields, and beta can retrieve beta's own document.

## Required negative case
Call the route as alpha with beta's known document ID and fake tenant query/body values; ensure beta's document never leaves the API even when Prisma connects with a privileged test role.

## Trust boundary
The example implements tenant-level access only. Add per-document ACLs when tenancy alone is too broad and test revocation/session freshness. Never prove RLS by using service_role credentials.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
