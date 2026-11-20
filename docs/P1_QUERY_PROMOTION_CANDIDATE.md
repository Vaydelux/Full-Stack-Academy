# P1 Query 09.03 — source candidates, release gates and handoff

**Updated:** November 21, 2026. **Branch:** `feat/p1-rhf-eight-lesson-depth-20261120`, PR [#38](https://github.com/Vaydelux/Full-Stack-Academy/pull/38).

## State and dependency order

The canonical curriculum has **889 topics**; **338 are actually published** on `main`. There are eight RHF module `09.02` source candidates and eight TanStack Query `09.03` source candidates. Source-only candidate existence **never** counts as course publication or evidence of a browser pass.

1. First qualify RHF `09.02` through actual Node 24/npm, Chromium/Next, and named human keyboard, screen-reader and 200%-zoom review; guard-publish **346/889**.
2. Only after `09.02` is genuinely published, qualify all Query `09.03` exercises including actual Next SSR hydration; guard-publish **354/889**.
3. Re-run source-derived checkpoint, `verify:offline`, browser route/quiz checks, review generated files and commit. No GitHub Actions/Vercel checks, auto-merges or deployments are used by the release commands.

## Eight Query candidate topic packages

| Topic | Source exercise | Distinct acceptance |
| --- | --- | --- |
| 09.03.01 Query keys and caching | `query-keys` | Distinct cache keys per filter |
| 09.03.02 Stale time and garbage collection | `stale-garbage` | Refetch vs cache residency |
| 09.03.03 Mutations and invalidation | `mutation-invalidation` | POST acknowledgement and fresh GET |
| 09.03.04 Optimistic updates and rollback | `optimistic-rollback` | Failed delete restores state |
| 09.03.05 Infinite queries | `infinite-queries` | Cursor and stale-page recovery |
| 09.03.06 Suspense and SSR hydration | `ssr-hydration` | Real Next server prefetch and client hydration |
| 09.03.07 Retries and cancellation | `retries-cancellation` | AbortSignal and bounded retries |
| 09.03.08 Lab remote task list | `remote-task-capstone` | RHF/Zod→HTTP→Query and 422 recovery |

`release-candidates/forms-query/09.03/` contains **52 files**: 16 MDX/metadata, 32 lab source/test/manifests, and four independent `providers.tsx`/`task-list.tsx` files for SSR. A Git blob comparison confirmed 16/16 starter and instructor TSX candidate copies are exactly identical to their original drafts. Eight candidate MDX files were run through the pure published-copy transformer: 8/8 preserved TSX fences and guided-step counts, with no stale draft warnings. Eight candidate lesson metadata objects and eight lab manifests were separately inspected with no schema-bound defects found.

## Read-only qualification and rehearsal

From repository root:

```bash
npm run test:js-syntax
npm run qualify:forms-query:source
npm run test:forms-query-query-candidates
npm run promote:forms-query:rhf -- --simulate
npm run promote:forms-query:query -- --plan
npm run promote:forms-query:query -- --simulate
```

The last command projects **54 live files** in memory: 16 lesson MDX/metadata files, 32 lab source/manifest/test files, four Next SSR support files and two published registries. It writes no files and grants no progress.

## Real runtime and accessibility release gate

Use a clean checkout on **Node 24**, real locked root and nested npm installations, and an actual Playwright Chromium installation via `ACADEMY_BROWSER_ROOT`. Run the real RHF browser gate and then the Query browser/SSR gate. The ephemeral loopback API is private to the local test machine, and the temporary Next SSR fixture rewrites both its server prefetch URL and route handler to the real allocated API port. Candidate or published per-lab wrappers additionally compare the actual starter/instructor source bytes to the tested source.

For Query, perform a **real** keyboard, 200% zoom and screen-reader review. Start from `docs/release-evidence/forms-query-09.03-accessibility.example.json` but do not claim it was approved. Read the `reviewSourceSha256` printed by `--plan`. An actual reviewed record must contain `reviewed:true`, `keyboard:true`, `zoom200:true`, reviewer, screen-reader name, ISO review date, all eight IDs, and the exact current source SHA-256. Save it as `docs/release-evidence/forms-query-09.03-accessibility.json` and commit it; a stale fingerprint is rejected.

Only after RHF is live and all genuine gates pass may the operator run:

```bash
npm run promote:forms-query:query -- --apply
```

This refuses a dirty worktree, missing Node24/Chromium, missing/stale human review and missing RHF prerequisites. It runs the full local suite, prepares files, recomputes the checkpoint, runs postpublication tests and restores the original source tree on failure. A passing result remains a **local, not deployed or merged, qualification** until reviewed and committed.

## Known unverified requirements

The current connected GitHub environment cannot clone dependencies locally. **No complete Node 24/npm install, Next production/SSR build, real Chromium run or human accessibility review has been executed here**. Source V8 syntax checks and pure MDX projections are not substitutes. PR #38 remains draft until those gates actually run. PR #39 covers separate P2 NestJS drafting and should not be merged as a substitute for P1 release qualification.

Next action: execute the source-only suite and 54-file simulation in a complete Node24 checkout, then run genuine acceptance and accessibility checks before applying any publication.
