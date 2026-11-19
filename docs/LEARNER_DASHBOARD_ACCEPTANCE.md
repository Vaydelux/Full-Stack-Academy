# Learner dashboard — source milestone acceptance

**Date:** 2026-11-19  
**Implementation branch:** feat/learner-dashboard-progress-20261119  
**Scope:** Browser-only personalized study hub without a new account, data service or external dependency.

## Delivered
- New /learn/dashboard route, intentionally noindex, linked from course index, documentation shell and workspace.
- Published-lesson-only progress read model grouped by canonical module. Unknown or duplicated IDs are not counted; bad minute estimates are clamped.
- Self-assessed completion totals, started/unfinished distinction, estimated remaining published study minutes, and a deterministic resume recommendation (prefer unfinished lessons with notes/quiz/rubric work).
- Responsive module cards with search, status filter, progress bars, and bounded progressive display. No 889-topic wall of cards.
- Explicitly acknowledged JSON restore and a 2 MB limit; imports reuse existing Zod v1 schema and normalized lesson data. Storage write failure now fails import instead of reporting fake success.
- Pure Node test cases for totals, resume priority, duplicate entries, note/completion status, and finished state; local verification script wired through test:learning-dashboard.

## Security and data boundaries
- Data stays in browser storage. No cloud sync, authentication or cross-device account is claimed.
- Quiz and rubric completion are learner self-reports, not independent evaluation.
- Backups contain learner-authored notes and reflections; exported files are private data.
- Import replaces local state, not merging competing changes. No multi-tab conflict resolution.
- No raw HTML injection or markdown-to-HTML conversion of learner notes.
- Dashboard links only to the published registry; planned lessons remain planned and noindex.

## Verification status
- GitHub source creation and navigation wiring completed; **full Node 24 npm installation, Next typecheck/build, Chromium, screen-reader and real-browser import/restore have not been run** in this environment.
- From a full checkout run: npm ci && npm run test:learning-dashboard && npm run verify:offline
- Browser checks: empty store, one quiz+note in progress, full module completion, mobile 320px, keyboard/zoom, long metadata titles, export/import success, storage-quota rejection, two-tab stale state.
- Do not call production-validated until run against an exact commit SHA.

## Next dependency-backed curriculum slice
09.02 React Hook Form and 09.03 TanStack Query must remain **planned**. Install real compatible packages, update package-lock.json from an actual npm resolution, implement hooks against those packages and execute runnable source tests. Do not hand-edit lockfile integrity or create fake APIs.
