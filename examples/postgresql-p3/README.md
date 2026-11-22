# PostgreSQL P3 — source-only release qualification

This folder contains **read-only integrity checks** and a narrowly scoped real SQL semantic runner for modules **12.03, 12.04 and 12.05**.

## How to run

From repository root:

```sh
npm run test:postgresql-p3-source
npm run status:postgresql-p3
```

These need Node.js only. They verify 24 canonical lesson/MDX/source files and manifest status, but **do not contact PostgreSQL**.

For real SQL semantics, create a dedicated PostgreSQL 17+ database named `academy_test` on **127.0.0.1 or localhost**, use a test-only login with permission to create temporary tables, install `psql`, then opt in:

```sh
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL='postgres://academy_tester:REDACTED@127.0.0.1:5432/academy_test'
npm run qualify:postgresql:p3
```

PowerShell equivalent:
```powershell
$env:ACADEMY_ISOLATED_PG='YES'
$env:PG_TEST_URL='postgres://academy_tester:REDACTED@127.0.0.1:5432/academy_test'
npm run qualify:postgresql:p3
```

The runner refuses remote hosts, production-like database names, missing opt-in and connection URL query overrides. Each variant uses a separate `psql` process and a rollback-only transaction. It will report no more than **14 instructor / 14 expected-red SQL semantic checks**.

**A green result is never a full PostgreSQL track release approval.** The 10 explicitly manual-evidence labs, true two-session races, EXPLAIN performance experiments, VACUUM, replica tests, privilege reviews, recovery drills and human accessibility checks remain independent.

## A real two-session concurrency exercise

The 12.03 SQL contract fixture uses temporary tables and cannot be observed from two sessions. For a *real* contention test, create a **persistent, isolated test table** on the dedicated `academy_test` database:

```sql
CREATE TABLE academy_concurrency_demo(id integer PRIMARY KEY, balance integer NOT NULL, version integer NOT NULL);
INSERT INTO academy_concurrency_demo VALUES (1,10,1);
```

Use **two different terminal connections** to the same disposable DB. In connection A, begin a transaction, update `id=1` with `WHERE version=1`, hold the lock using `SELECT pg_sleep(5)`, and commit. Start connection B while A is holding the lock. B attempts the same guarded UPDATE and waits; after A commits, B should observe **zero rows updated** rather than silently overwrite the balance. Repeat with an intentional error and `ROLLBACK`; verify the database state. Record the actual SQLSTATE, commands, version and result for reviewer inspection.

Do **not** run this test on a production table. On the isolated test database, explicitly drop `academy_concurrency_demo` when done.

## Operator evidence

For 12.04.01, 12.04.05, 12.04.07 and 12.04.08, record query size, EXPLAIN plan, repeated measurements and caveats; execute VACUUM **outside** a transaction.

For 12.05.01, 12.05.02 and 12.05.05–12.05.08, follow each lab's `acceptance.md` to collect actual backup, replication, role, pooler and restore observations. A temporary table fixture is not a recoverable backup; a real drill needs independently created disposable persistent sample objects and an isolated restore target.

**Release state:** all 24 lessons are still `draft-unverified`. The published academy count remains 338/889 and Vercel Git deployment remains disabled.
