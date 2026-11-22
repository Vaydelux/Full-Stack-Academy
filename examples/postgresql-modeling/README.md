# PostgreSQL 12.02 — Relational Modeling (source-staged)

Eight unpublished manuscripts follow canonical lessons `12.02.01–12.02.08`: normalization, surrogate/business keys, many-to-many, tenant-safe keys, soft delete/history, CHECK and uniqueness, audit tables, and a missing-tenant-filter investigation.

Each lesson includes a red SQL starter, corrected instructor SQL, an executable semantic `DO` assertion, three teaching steps, and references to official PostgreSQL documentation. The shared fixture uses PostgreSQL temporary tables for **alpha** and **beta** organizations with deliberately overlapping member IDs.

## Read-only source test

```sh
npm run test:postgresql-modeling-source
npm run status:postgresql-modeling
npm run status:publication-phases
```

These checks verify the article/source mapping and authoring integrity, **not** SQL execution or publication.

## Real database qualification (required before release)

Use a dedicated local `academy_test` database and a least-privileged test user with temporary table creation rights. Do not run against production:

```sh
export ACADEMY_ISOLATED_PG=YES
export PG_TEST_URL='postgres://academy_tester:YOUR_LOCAL_TEST_PASSWORD@127.0.0.1:5432/academy_test'
npm run qualify:postgresql:12-02
```

PowerShell example: `$env:ACADEMY_ISOLATED_PG='YES'`; `$env:PG_TEST_URL='postgres://academy_tester:...@127.0.0.1:5432/academy_test'`.

The runner rejects remote hosts, incorrect database names, missing opt-in and missing explicit DB user names. It uses one fresh connection for each red/green test inside a rollback-only transaction; credentials are passed through subprocess environment variables, **not command-line arguments**. A red case counts only if its exact named semantic assertion fails, not merely because SQL was malformed.

The runner verifies 8 corrected and 8 intentionally broken cases against actual PostgreSQL if such a server is present. This has **not yet run in the current environment**. These examples are not production authorization mechanisms or certified audit systems.

## Publication policy

Do not import the MDX or mark any 12.02 lesson complete until: real PostgreSQL positive/negative tests, Node24 root qualification, Next production build, browser/keyboard checks and named human accessibility review have passed. Keep the published count source-derived and unchanged.
