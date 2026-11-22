# 12.04.01 — manual evidence gate

**This lab has NOT been automatically or manually qualified by the authoring action.**

## Validating the hypothesis

Record database version, dataset cardinality, actual row count, buffers and latency for three runs. Explain estimated versus actual rows. Do not assert a performance win without a matched workload and measured baseline.

## Failure mode

The starter only requests an estimated plan. It cannot demonstrate actual execution, rows, and buffer activity.

## Safety and limits

EXPLAIN ANALYZE executes statements. Only use SELECT against disposable data here; be cautious with DML. On a tiny teaching table PostgreSQL may correctly choose a sequential scan, so no exact plan node is a grading contract.

Record PostgreSQL version, exact dataset size, machine settings, session/session-connection parameters, recorded query-plan output and reproducible commands. Mark this lesson **unverified** until a reviewer attaches actual evidence. A successful SQL command alone is not sufficient; do not fabricate a benchmark or turn this into a forced index-scan assertion.
