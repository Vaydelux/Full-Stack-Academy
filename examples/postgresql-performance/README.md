# 12.04 — Query Performance

Eight manuscript lessons: **four SQL semantic contracts** for index definitions, cursor results and server connection settings; **four manual measured-evidence labs** for EXPLAIN ANALYZE, N+1, VACUUM and slow-query profiling.

There is no magic performance check: a tiny teaching table may reasonably use a sequential scan. Record data cardinality, database settings, actual EXPLAIN rows/buffers and repeated latency, and evaluate write costs. VACUUM requires a separate transaction-free session.

See each lesson's `acceptance.sql` or `acceptance.md`. None is published or runtime-qualified yet.
