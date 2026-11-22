# 12.04.08 — manual evidence gate

**This lab has NOT been automatically or manually qualified by the authoring action.**

## Validating the hypothesis

Capture baseline and after plan, query rows, database version, dataset size, p50/p95 over repeated trials, shared buffers and total index size. Record a neutral result if there is no improvement.

## Failure mode

The starter has no targeted index and lacks measured before/after optimization evidence. SQL syntax alone cannot establish improvement.

## Safety and limits

A nine-row fixture is too small to establish an index advantage. Recreate this comparison on a sufficiently large disposable dataset; consider cache warming and write amplification, and do not force a plan to fabricate a speedup.

Record PostgreSQL version, exact dataset size, machine settings, session/session-connection parameters, recorded query-plan output and reproducible commands. Mark this lesson **unverified** until a reviewer attaches actual evidence. A successful SQL command alone is not sufficient; do not fabricate a benchmark or turn this into a forced index-scan assertion.
