# F9.2 — Guarded PostgreSQL review and apply

The two fully SQL-contract modules 12.01/12.02 now have an explicit local lifecycle. No actual module was promoted; 338/889 remains the published count and 09.02 is next.

## Use on an actual workstation
- Complete P1 and P2 first with their existing guarded commands. P3 starts at 386 published.
- Install Node 24.9+ stable, genuine tracked root/forms/Nest lockfiles, Playwright via absolute ACADEMY_BROWSER_ROOT, and actual local PostgreSQL 17+ with psql and a disposable nonprivileged academy_test database. Set ACADEMY_ISOLATED_PG=YES and PG_TEST_URL as documented; do not point at production or a tunnel. A plan reports blockers without mutation.
- npm run promote:postgresql -- --plan 12.01
- Create a disposable detached linked worktree at the exact current HEAD, using git worktree add --detach ../academy-pg-review HEAD. From that checkout run npm run promote:postgresql -- --review 12.01. It checks real SQL, projects all eight lessons, regenerates checkpoint, validates content and source, builds and runs Chromium acceptance on three viewport sizes per lesson. On success it prints a temporary review.json path containing the actual red/green receipt and blank human review fields. Inspect each lesson manually and record actual editorial, keyboard, zoom, screen-reader, contrast and responsive observations. Never commit or deploy the review fixture with synthetic metadata dates. Discard that worktree.
- Place the completed review.json at docs/release-evidence/postgresql-12.01.json in the original clean checkout, review and commit only that evidence. Do not edit other sources between review and apply: the fingerprint binds the entire tracked index except the specific evidence file and binds the deterministic projection. Evidence structure and checksum do not establish reviewer identity.
- npm run promote:postgresql -- --apply 12.01
- Apply revalidates evidence, reruns real SQL, projects with actual review date, regenerates checkpoint, runs all local verification plus browser acceptance and validates exact projected bytes and permitted worktree changes. On success changes remain local and uncommitted; inspect the diff before any commit. Repeat for 12.02, which starts at 394 and targets 402.

Synchronous failure rolls back every projected file and checkpoint to its original bytes. This is not a process-crash-atomic transaction; an abrupt process termination or unrelated tool changes may require manual recovery. Always use a disposable checkout, avoid concurrent edits, and inspect git status after any failure. No auto-commit or deployment occurs. Full offline qualification may reveal additional retained-draft or test assumptions; do not bypass failures.

## Test evidence
Seven isolated Node24.11.1 guard tests passed using synthetic SQL-result and review fixtures and actual temporary filesystem operations. They cover order, source/index fingerprint, receipt shape, reviewer fields, rollback, traversal/symlinks, and partial/altered live-artifact detection. Neither actual PostgreSQL nor the complete Academy checkout/browser has been run in this environment. The new browser command reuses the existing eight-topic Chromium route gate; human accessibility remains separate. The legacy source audits were updated to recognize retained drafts alongside matching live artifacts. The generic offline runner executes published SQL labs sequentially and fails when the required DB is missing.

12.03 concurrency and 12.04/12.05 mixed manual contracts are intentionally not promoted by this command. Next complete per-topic real multi-session/recovery/performance gates, then extend projection and promotion. The earliest executable production publication remains 09.02; do not skip it.
