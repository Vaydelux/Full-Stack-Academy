# 13.01.06 — qualification plan, NOT executed

## Expected positive behavior
With two disposable databases, generate in dev, inspect the migration SQL and use migrate deploy on test. Record schema, checksum, deployment order and rollback strategy.

## Required negative test
A reviewer must reject any pipeline invoking migrate dev or db push against production credentials. Verify that no unreviewed schema mutation is admitted.

## Trust boundary
A successful CLI exit does not prove zero downtime. Consider locks, concurrent app versions, backfills and irreversible migrations before applying SQL to production.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
