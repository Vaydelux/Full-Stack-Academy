# 13.04.05 — manual integration qualification, NOT EXECUTED

## Positive real-test case
The same authenticated alpha user can list only permitted tasks using a verified membership table and least-privileged DTO response.

## Required negative case
Log in as alpha, then set query tenantId=beta and enumerate a known beta task. The endpoint must deny or ignore the untrusted parameter.

## Trust boundary
A TypeScript request interface does not validate the JWT by itself. The guard must verify signature, issuer, expiry, audience/session and fresh permissions when required.

Use the local Supabase stack and a dedicated PostgreSQL database with version-pinned Prisma ORM 7. Configure a verified NestJS Auth guard, two independent users, and a least-privileged SQL login. Avoid real credentials, production schema modification, or service-role client tests presented as ordinary user RLS evidence.
