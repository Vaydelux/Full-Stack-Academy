# 12.03 — Transactions and Concurrency

Eight new unpublished lessons, each with `starter.sql`, `solution.sql`, a named `acceptance.sql`, a draft-only metadata file and guided MDX manuscript. The dataset uses disposable wallet, job, idempotency and audit-event tables.

The default real SQL runner validates **eight one-connection semantic cases**. This is not a substitute for two-session isolation, lock contention or retries. Use the example in `examples/postgresql-p3/README.md` to validate a real optimistic write race in a dedicated test database.

Never place this fixture into production migrations or claim exactly-once remote side effects from database transactions alone.
