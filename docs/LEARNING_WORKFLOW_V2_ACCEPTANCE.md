# Learning Workflow v2 — acceptance and handoff

**Date:** 2026-11-19
**Branch:** feat/learning-workflow-bookmarks-catalog-20261119
**Scope:** Saved learning library, lesson-level study notes, catalog discovery and local progress reliability. No new curriculum topic is counted as published.

## Delivered source

### A. Saved learning library
- Extend existing Zod-validated v1 progress backup data with an optional-defaulted bookmarks record. Existing backups lacking the key still parse; no breaking backup version bump.
- Normalize imported bookmarks against PUBLISHED_LESSON_IDS (trusted allowlist); unknown lesson IDs and false values do not become saved lessons.
- Store action toggleBookmark guards unpublished IDs. Delete unbookmarked keys rather than persisting unnecessary false entries.
- Render Save lesson / Saved lesson toggle and expandable private note editor on both published MDX lessons and interactive articles.
- Use explicit Save note, 20,000-character maximum, unsaved-edit warning and storage failure feedback. Preserve local unsaved edits across external storage changes.
- On /learn/dashboard, add a saved-work shelf with title/topic search, bookmarked/notes filters, progressive display and remove-bookmark action.
- Saved note bodies are never searched, previewed publicly or sent to a remote API.

### B. Curriculum discovery
- Replace the pre-rendered 338-card All published lessons accordion with a compact searchable and progressive catalog.
- Filter by module and difficulty, search lesson ID/title/module/description with AND-token matching, and rank exact ID/title matches above generic matches.
- Deduplicate published catalog IDs, bound query length and pagination, and preserve all canonical lesson URLs and sitemap entries.
- Available module/track navigation below the explorer still describes planned work; planned pages retain noindex and cannot be bookmarked as authored lessons.

### C. Local-first reliability
- Add one client-only root component for progress hydration, global dark/light theme application and same-origin localStorage events from other tabs.
- LocalStorage access-denied errors do not throw from the storage event listener.
- Surface unsaved-storage warnings for lesson notes, dashboard changes and existing interactive workspace notes.
- Study planner now prioritizes already-started eligible lessons, then bookmarks, then untouched eligible lessons; no bookmark can bypass a missing prerequisite.
- Existing backup import remains a replacement operation, not automatic cloud sync.

## Verification evidence (what actually executed)

Exact GitHub branch source was fetched and inspected without GitHub Actions or Vercel.
- **14/14 behavior cases passed** for src/lib/academy/lesson-discovery.ts, evaluated in an isolated JavaScript runner after mechanically removing TypeScript-only annotations from the committed source. Test definitions came from tests/lesson-discovery.test.mjs.
- **11/11 behavior cases passed** for src/lib/academy/study-plan.ts with the same isolated source transformation; source tests from tests/study-plan.test.mjs.
- **7/7 structural assertions passed** against 15 exact branch file contents; equivalent assertions checked in at tests/learning-workflow-integrity.test.mjs.
- JSON package script edits parsed successfully.
- **Not executed:** complete local Node 24 checkout/npm ci, genuine Node test runner on all branch source files, TypeScript Next app typecheck, production build, Chromium/mobile/keyboard/screen-reader browser verification, real two-tab and storage quota interaction, full 337+ lab suites, all prior negative learner tests.

A JavaScript-transformed source test is narrower than TypeScript compilation or browser/runtime integration; do not call this production-qualified.

## Acceptance commands, once a complete checkout and npm registry are available

1. Node 24: npm ci
2. npm run test:lesson-discovery
3. npm run test:study-plan
4. npm run test:learning-workflow
5. npm run verify:offline
6. Run local Next.js browser at 320px, 768px, and desktop. Test keyboard search/filter, focus order, live result counts, overflow, and saved-note details.
7. Verify v1 backup without bookmarks imports, unknown bookmark IDs are dropped, saved note export/restore works, and corrupt/oversized backup returns an error.
8. Verify two-tab note changes, unsaved local draft preservation, storage denied/quota-full warning, and last-writer conflict behavior.

## Known limitations

- Local browser storage, not authenticated durable storage; no cross-device synchronization.
- Across tabs, updates are last-write-wins; simultaneous writes may still conflict. This feature refreshes another tab when a storage event arrives but does not provide conflict-free multi-writer editing.
- Learner self-assessment is not grading or observed skill verification.
- No arbitrary user HTML or remote code execution; saved data remains plain text.
- React Hook Form 09.02 and TanStack Query 09.03 remain planned because external npm registry and GitHub clone DNS resolution were unavailable locally; do not fabricate dependency locks or count those lessons as authored.
- The 2026-12-02 UTC historical dev-only Picomatch advisory exception still needs explicit review during release qualification.

## Next large scope after merge

Prioritize real Node 24 dependency resolution and tests, then the 16-lesson RHF + TanStack Query vertical slice (docs/FORMS_QUERY_NEXT_MILESTONE.md). Continue with real NestJS and PostgreSQL module families only after compatibility dependencies and runnable labs exist. Avoid stacking unqualified branches.
