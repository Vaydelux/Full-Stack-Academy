# 13.01.08 — qualification plan, NOT executed

## Expected positive behavior
Generate the Prisma 7 client, create a disposable test schema with two tenant datasets, run the read, capture results and verify no service credentials reach the browser.

## Required negative test
Request the same list for alpha and beta. Assert neither response contains the other's data. Try missing tenant context and assert it fails before querying.

## Trust boundary
Prisma's server-side database user may bypass Supabase RLS. Enforce tenant/object authorization at the API boundary and prefer least-privileged database roles.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
