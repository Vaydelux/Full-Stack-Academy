# 13.01.01 — qualification plan, NOT executed

## Expected positive behavior
Inspect the Prisma schema and generated SQL migration in an isolated database; verify the tenant_id equivalent is NOT NULL and indexed. Test a tenant-filtered query against rows from both organizations. Running prisma validate alone is not an authorization test.

## Required negative test
Attempt to represent two tenants each with task id 1. Explain that an autoincrement id is globally unique in this model, while authorization still requires a verified tenant predicate.

## Trust boundary
No schema generator or @unique attribute grants a caller read permission. Never treat a Prisma model type as a replacement for Postgres RLS or server authorization.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
