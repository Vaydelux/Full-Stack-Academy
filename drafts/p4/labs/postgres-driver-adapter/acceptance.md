# 13.01.04 — qualification plan, NOT executed

## Expected positive behavior
Install pinned prisma, @prisma/client and @prisma/adapter-pg versions; run generate and a read-only SELECT with a dedicated test role. Validate TLS/connection-pool behavior with the real adapter.

## Required negative test
Unset DATABASE_URL in a local test to verify a clear startup error. Confirm no credentials are logged or serialized into browser bundles.

## Trust boundary
A Prisma adapter connection may use a privileged database role and bypass Supabase RLS. A server-side connection is not automatically authorized for every tenant.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
