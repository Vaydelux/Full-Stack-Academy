# P1 — Human review and publication handoff (2026-11-26)

Baseline main: `922ab1e148e94092fe8240f949a1fa04b208e80f`. This is a review worksheet, not evidence of human approval. No publication or progress credits are granted by this document.

## Current evidence

- 338/889 published, 551 reading editions, 69 incomplete modules. All 889 canonical topics have authored source.
- Git tree audit at the baseline: 48 RHF and 52 Query candidate files; 16/16 staged candidates have matching original/candidate starter and instructor TSX Git blobs (32/32 comparisons), lab manifest and acceptance test file. All four SSR support files exist. No P1 live metadata files. Neither module has a real accessibility JSON; both have intentionally unapproved example JSON.
- F20.16–17: 8 RHF and 8 Query instructor browser checks passed, and corresponding negative starters were rejected; isolated SSR hydration confirmed prefetched HTML and zero client requests in the instructor variant. These results span earlier commits. F20.21 offline quality matrix 82/82 passed on 2a2e419, with 337 instructor lab files and 1252 generated pages. No single consolidated release coordinator receipt.
- PR #73 merged at baseline; production deployment dpl_ExkhkRTLdy1qX8GtkUz86gSq4XFa READY and domain assigned, but project API still reports live:false and public HTTP not confirmed. Do not use hosted availability or draft pages as a substitute for projected final review.

## Review procedure (Windows or Linux workstation)

1. Use a clean candidate checkout with Node 24.9+ (24.x stable), Python 3, Git and isolated Playwright. Install the browser outside the checkout; set ACADEMY_BROWSER_ROOT and ACADEMY_CHROME_BIN to actual paths. Use a named human reviewer and a real screen reader (e.g. NVDA on Windows). Run the existing coordinator plan; retain exact receipts.
2. From the clean candidate, run `npm run promote:forms-query:rhf -- --plan` and `npm run promote:forms-query:rhf -- --simulate`. Record the current reviewedSourceSha256. Use `git worktree add --detach ../academy-review-rhf HEAD` to create a disposable linked review worktree. In that worktree run `npm run promote:forms-query:rhf -- --review` as documented in F2_P1_PUBLICATION_HANDOFF.md. Review mode is an intentionally synthetic projection, never commit or deploy it. Serve the projected application on loopback with `npm run start -- --hostname 127.0.0.1`.
3. Review each projected canonical lesson URL (/learn/ID), associated lab and navigation, at default zoom and 200% browser zoom, keyboard-only and with the named screen reader. Check headings/landmarks, focus order and visibility, skip link, accessible names, code-copy feedback, quiz feedback, lab controls/status/error announcements, contrast and reflow. Record actual observed failures and steps to reproduce; do not mark a failed/untested case as passed. Review draft routes only as supplemental evidence.
4. For each lesson, record the result of keyboard, 200% zoom, screen reader and topic-specific focus check below. Blank or failed cells mean incomplete. Fix observed defects, regenerate projection and fingerprint, and repeat affected review.
5. When all eight lessons actually pass, complete the existing example JSON fields honestly (named reviewer, screen reader, date, exact current fingerprint, exact eight lesson IDs, reviewed/keyboard/zoom200 true only if verified). Commit the real evidence at `docs/release-evidence/forms-query-09.02-accessibility.json` on the publication candidate branch. On a clean checkout of that branch run `npm run promote:forms-query:rhf -- --apply`. It performs real preflight, atomic publication and postflight with rollback. Inspect diff and PR; target 346/889. Do not bypass failed checks or copy review fixture into main.
6. After RHF publication, repeat Query plan, simulation, detached review, named human evidence and apply for 09.03. Use the current reviewSourceSha256, and the existing `forms-query-09.03-accessibility.example.json` schema. Target 354/889. Retain exact receipts and review records. No automatic deploy.

## Worksheet (not an approval record)

| ID | Lesson | Topic-specific human check | Keyboard | 200% zoom | Screen reader | Notes |
|---|---|---|---|---|---|---|
| 09.02.01 | Controlled vs uncontrolled inputs | Verify input labels and accessible names; keyboard input updates both examples predictably. | Not run | Not run | Not run | — |
| 09.02.02 | Register and Controller | Reach and operate registered/controlled fields; confirm values and errors are announced. | Not run | Not run | Not run | — |
| 09.02.03 | Zod resolvers | Trigger invalid input and confirm associated error, correction guidance and focus. | Not run | Not run | Not run | — |
| 09.02.04 | Dynamic field arrays | Add/remove/reorder rows by keyboard; confirm focus remains logical and row labels are distinct. | Not run | Not run | Not run | — |
| 09.02.05 | Async submissions | Submit with keyboard; confirm loading, success/error feedback and duplicate-submit prevention. | Not run | Not run | Not run | — |
| 09.02.06 | Reset and dirty state | Change, reset and restore values; verify dirty-state feedback is understandable without color. | Not run | Not run | Not run | — |
| 09.02.07 | Server errors and focus | Trigger server validation; verify focus reaches the invalid control and error is announced. | Not run | Not run | Not run | — |
| 09.02.08 | Bug Hunt mismatched form state | Reproduce the state mismatch and verify corrected feedback and completion controls. | Not run | Not run | Not run | — |
| 09.03.01 | Query keys and caching | Switch filters by keyboard; distinguish query states and cached data without relying on color. | Not run | Not run | Not run | — |
| 09.03.02 | Stale time and garbage collection | Inspect stale/fresh and loading states; confirm status changes remain understandable. | Not run | Not run | Not run | — |
| 09.03.03 | Mutations and invalidation | Trigger mutation; verify feedback, list refresh and error recovery. | Not run | Not run | Not run | — |
| 09.03.04 | Optimistic updates and rollback | Trigger failed optimistic mutation; verify rollback and error announcement. | Not run | Not run | Not run | — |
| 09.03.05 | Infinite queries | Load additional pages using keyboard; verify appended content and logical focus. | Not run | Not run | Not run | — |
| 09.03.06 | Suspense and SSR hydration | Inspect server-rendered content and hydration; verify reading order and absence of misleading loading feedback. | Not run | Not run | Not run | — |
| 09.03.07 | Retries and cancellation | Trigger retries/cancellation; verify status and controls remain accessible. | Not run | Not run | Not run | — |
| 09.03.08 | Lab remote task list | Complete the task-list workflow; verify forms, errors, list updates and recovery by keyboard and screen reader. | Not run | Not run | Not run | — |

Record browser/OS, screen reader/version, reviewer, review date, exact source fingerprint, actual pass/fail and reproduction notes. The worksheet never substitutes for the real JSON evidence. Keep personal information minimal; no credentials in evidence.

## Completion and subsequent work

P1 publication is blocked by actual human review and exact guarded apply. P2/P3 qualification may be prepared in parallel, but publication order is fixed. Nest lock already exists and Nest runtime/live PostgreSQL/Socket.IO evidence is recorded; PostgreSQL 30 SQL positive/negative pairs passed, ten operational/manual topics remain. Refer to NEXT_TODO.md and the existing curriculum publication queue; do not regenerate locks or repeat prior successful broad suites solely because older historical notes were not updated. Requalify exact release source when the promoter requires it. No new product features or lesson IDs.

## Shared review evidence contract

Both promoters and the readiness audit now require the same per-lesson evidence format. Use the updated unapproved example JSON for the module. Fill browser and operating system (including version), reviewer and screen reader. Keep the exact ordered eight lesson IDs and one observation record for each. In each record, describe the actual observed keyboard behavior, 200% zoom/reflow behavior, screen-reader behavior and topic-specific result; each field requires at least 20 characters of non-placeholder observations. Mark `passed` true only after all checks for that lesson pass. Record actual defects before correction and repeat the affected review. Do not copy synthetic test fixture observations. Review dates must be valid calendar dates from 2026-11-25 through the current date. Structural validation never proves the identity of the reviewer or that the checks were actually performed. No publication is approved by this worksheet.
