# P3: PostgreSQL Fundamentals (12.01) — authoring checkpoint

**Date:** November 22, 2026
**Repo:** Vaydelux/Full-Stack-Academy
**Work branch:** `feat/p3-postgresql-12-01-lessons-20261122`
**Base:** `main` at `dc4e43a70076cc3afc5be2b7672f7fe2502deef4`
**Publication:** Source-only drafts, not in live MDX/metadata registries.

## Delivered

Eight substantial instructional articles were authored from the canonical
`data/curriculum.json` titles, each containing a concept explanation,
prerequisites, prediction, guided three-step implementation, intentionally
wrong starter SQL, corrected instructor SQL, a bug hunt, an automated SQL
acceptance assertion, a misconception correction, knowledge check, trust
boundaries and official PostgreSQL references.

| Canonical ID | Lesson | Required negative assertion |
| --- | --- | --- |
| 12.01.01 | Tables rows columns and types | Cross-tenant/user-email exposure rejected |
| 12.01.02 | SELECT WHERE ORDER BY | Wrong filtered row IDs rejected |
| 12.01.03 | JOINs | Incorrect FK join/tenant result rejected |
| 12.01.04 | GROUP BY and aggregates | Empty-project COUNT(*) regression caught |
| 12.01.05 | Foreign keys and constraints | Orphan and blank-note writes rejected |
| 12.01.06 | NULL and three-valued logic | = NULL bug caught |
| 12.01.07 | CTEs and subqueries | Wrong count/tenant exposure caught |
| 12.01.08 | Lab query workbook | Wrong owner/open-task count caught |

Files per lesson: `drafts/postgresql/lessons/{id}.mdx`,
`{id}.meta.json`, and `drafts/postgresql/labs/{slug}/` containing
`starter.sql`, `solution.sql`, `acceptance.sql` and `lab.json`.
The module includes a shared temporary-table fixture and a JSON inventory.

Added `examples/postgresql-basics/scripts/verify-source.mjs` with source
integrity checks and `tests/source.test.mjs` mutation checks. Added a
fail-closed PostgreSQL red/green runner that requires an explicit
`ACADEMY_ISOLATED_PG=YES`, a local `academy_test` database and
real `psql`. It validates instructor **and** learner-negative behavior.

## Evidence and limitations

**Source authored and committed:** all eight MDX/metadata and 32 per-lesson
SQL/lab files. The two historically misleading red starters (12.01.01 and
12.01.04) were corrected to fail on a named acceptance assertion rather
than missing result columns. File and JS source checks are performed
separately from any real PostgreSQL connection.

**Not executed in this session:** PostgreSQL acceptance SQL, root npm/Next
build, browser navigation, human screen-reader/keyboard/200% zoom review.
This environment does not have `psql` or a dedicated PostgreSQL service.
A source-only pass must NEVER be counted as a PostgreSQL runtime pass.

## Next milestones

1. On an isolated PostgreSQL 17+ installation, execute
   `npm run qualify:postgresql:12-01` with dedicated test credentials;
   repair any real failed lesson SQL or acceptance cases.
2. Execute `npm run test:postgresql-drafts` and the root
   `npm run verify:offline` on a complete Node 24 checkout.
3. Run the Next production build and accessible browser/manual review.
4. Keep the eight lessons **unpublished** until P1 RHF/Query and P2 Nest
   release gates pass in the established phase sequence.
5. Do not change the 889-topic canonical curriculum or the existing
   published count **338/889**. No deploy, merge or release claims without
   their actual evidence.

Source-staged content and prepublication qualification are different
milestones. No fictitious runtime status or generated npm lockfile was added.
