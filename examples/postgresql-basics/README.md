# PostgreSQL 12.01 — real SQL teaching labs

Eight canonical, **unpublished** lessons are authored as MDX with carefully paired red
learner starter SQL, corrected instructor SQL and PostgreSQL acceptance assertions.
Every lesson has its own negative bug hunt and official reference.

| Lesson | Lab slug |
| --- | --- |
| 12.01.01 Tables rows columns and types | tables-types |
| 12.01.02 SELECT WHERE ORDER BY | select-filter-order |
| 12.01.03 JOINs | relational-joins |
| 12.01.04 GROUP BY and aggregates | grouping-aggregates |
| 12.01.05 Foreign keys and constraints | foreign-keys-constraints |
| 12.01.06 NULL and three-valued logic | null-logic |
| 12.01.07 CTEs and subqueries | ctes-subqueries |
| 12.01.08 Lab query workbook | query-workbook |

## Source-only qualification (no DB dependency)

From the repository root, run `npm run test:postgresql-drafts` or
`npm run status:postgresql-drafts`. The source checker validates eight
canonical IDs, MDX starter/instructor code-fence parity, lab manifests,
official reference links, publication guards and the 338 baseline.
The offline audit **does not** execute SQL.

## Real PostgreSQL acceptance (mandatory before publication)

Use a locally running PostgreSQL database named `academy_test`, separate
from development and production databases. Install `psql` and explicitly opt in:

```sh
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL='postgres://test-user:REDACTED@127.0.0.1:5432/academy_test'
npm run qualify:postgresql:12-01
```

PowerShell: `$env:ACADEMY_ISOLATED_PG='YES'`,
`$env:PG_TEST_URL='postgres://test-user:...@127.0.0.1:5432/academy_test'`.

The runner refuses remote hosts, non-test database names and missing opt-in;
each case executes in its own psql session, creates temporary tables,
runs the acceptance assertions and rolls the transaction back.
It requires **both** the instructor to pass and the intentionally broken
starter to fail its own named semantic assertion—not from SQL syntax or a
missing table. No persistent schema, server or service credentials are
provided. Do not use a production database.

Passing SQL checks is still **not publication permission**: full Next
build, browser navigation/keyboard behavior and human accessibility
evidence remain separate release gates. The P1/P2 release order is retained.
