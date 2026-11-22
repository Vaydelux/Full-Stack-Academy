# 12.04.07 — manual evidence gate

**This lab has NOT been automatically or manually qualified by the authoring action.**

## Validating the hypothesis

Create a separate test table, generate/update/delete a representative sample, commit, inspect pg_stat_user_tables before/after, run VACUUM (ANALYZE), and record the outcome with caveats about autovacuum and async stat timing.

## Failure mode

The starter updates statistics but does not perform vacuum maintenance. It cannot prove that dead tuples and visibility state were addressed.

## Safety and limits

VACUUM cannot run inside a transaction block. This exercise must be run manually outside the rollback-only SQL-contract runner, against a dedicated disposable database. A tiny fixture cannot demonstrate meaningful bloat.

Record PostgreSQL version, exact dataset size, machine settings, session/session-connection parameters, recorded query-plan output and reproducible commands. Mark this lesson **unverified** until a reviewer attaches actual evidence. A successful SQL command alone is not sufficient; do not fabricate a benchmark or turn this into a forced index-scan assertion.
