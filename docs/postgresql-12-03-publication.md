# PostgreSQL 12.03 guarded publication candidate

This is implementation support, not a publication receipt. The canonical next module must be 12.03, with 402 published lessons; the target is 410. P1/P2 and 12.01–12.02 cannot be skipped.

- Plan: `npm run promote:postgresql -- --plan 12.03`
- Review: use a clean detached linked worktree and `npm run promote:postgresql -- --review 12.03`. Never commit the review fixture.
- Apply: only after a genuine named human review is tracked at `docs/release-evidence/postgresql-12.03.json`, use `npm run promote:postgresql -- --apply 12.03` in a clean checkout. This is local only; inspect the diff before any commit.
- Recover an interrupted projection: stop all qualification processes, preserve the Git index and HEAD, then `npm run promote:postgresql -- --recover`.

Both explicit database approvals are required: `ACADEMY_ISOLATED_PG=YES` and `PG_TEST_URL` for the semantic checks, plus `ACADEMY_DISTRIBUTED_PG_ISOLATED=YES` and `ACADEMY_DISTRIBUTED_PG_URL` for the dedicated academy_test_distributed database. Use PostgreSQL 17+, numeric loopback for the distributed URL, restricted non-superuser roles, and the existing tracked distributed runtime lockfile. Never reuse production credentials. Node 24 and the existing Playwright/browser prerequisites remain mandatory.

Every lesson must pass its named semantic red/green contract and the independently executed transaction exercise. The receipt records exact deterministic observations from all eight cases and binds them to the projected source and Git index. These cases demonstrate specified transaction behavior; they do not prove every isolation level, production durability, or human accessibility.

The 59-file SQL projection and checkpoint are written through the existing recovery journal. Build, browser checks and postflight checks remain required. The original drafts remain intact. The general persistence export remains a non-applicable review-only overlay, separate from this guarded local path.

Current qualification: implementation candidate only. Full offline, real PostgreSQL and browser runs must be repeated on the exact commit; no review evidence is fabricated.
