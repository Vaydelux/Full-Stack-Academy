# 13.01.05 — qualification plan, NOT executed

## Expected positive behavior
Run the version-pinned Prisma CLI in an isolated checkout; confirm the config is discovered and that the migration URL points to the disposable database, not production.

## Required negative test
Search the built client bundle and repo for NEXT_PUBLIC_DATABASE_URL and real secrets. Intentionally run the CLI without DATABASE_URL and ensure the error is local and does not expose the secret.

## Trust boundary
CLI config is not automatic authorization. A correct URL can still connect as a superuser; explicitly scope roles, environment and migration rights.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
