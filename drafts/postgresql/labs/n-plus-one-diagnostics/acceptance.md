# 12.04.05 — manual evidence gate

**This lab has NOT been automatically or manually qualified by the authoring action.**

## Validating the hypothesis

Instrument the real client query executor. Compare calls as project count increases (1, 10, 100), row cardinality and response bytes. Avoid claiming an improvement without measured results.

## Failure mode

The starter illustrates repeated per-project queries. An API loop that repeats the second query for every returned project causes network and planning overhead.

## Safety and limits

A JOIN can multiply parent rows and be inefficient for deeply nested relationships. Alternatives include two batched IN queries, data loaders, and aggregate JSON; measure total calls and bytes.

Record PostgreSQL version, exact dataset size, machine settings, session/session-connection parameters, recorded query-plan output and reproducible commands. Mark this lesson **unverified** until a reviewer attaches actual evidence. A successful SQL command alone is not sufficient; do not fabricate a benchmark or turn this into a forced index-scan assertion.
