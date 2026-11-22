# Full-Stack Academy — Curriculum & Progress Checkpoint

**Date:** November 22, 2026  
**Repository:** `Vaydelux/Full-Stack-Academy`  
**Scope:** Source authoring + progress reporting, not deployment or lesson publication.

## Progress snapshot (source-derived)

| Category | Count | Meaning |
| --- | ---: | --- |
| Canonical syllabus | **889** | Topics defined in `data/curriculum.json` |
| Published | **338** | Learners can open these lessons |
| Authored drafts | **64** | Source manuscripts waiting for release qualification |
| Not authored | **487** | Remaining canonical topics without a released or staged lesson |
| Modules | **111** | Fixed canonical syllabus |
| Fully published modules | **42** | Source-derived checkpoint baseline |

The 64 staged topics comprise P1 React Hook Form and TanStack Query (16), P2 NestJS (32), and P3 PostgreSQL 12.01 and 12.02 (16). **Staged does not imply runtime-pass or availability.** Remaining unpublished is `889−338=551`, which includes 64 staged and 487 unstarted. The 338 published count was not altered.

## User-facing progress and course UX

- Added a read-only `/learn/roadmap` page with overall published/drafted/planned counts and accessible per-phase, per-module details. It is a **course development status** view—not a replacement for the existing `/learn/dashboard` personal progress, bookmarks, notes, or study plan.
- Linked the roadmap from `/learn`, the dashboard and track pages; track rows distinguish drafts from not-yet-authored topics.
- The progress data derives from canonical curriculum, actual published registry, staged lesson metadata directories and a single phase-definition JSON shared by the source verifier and page. Unknown, duplicate or prematurely published draft IDs fail closed. It never increments learner completion.
- Phase status commands now include the PostgreSQL draft directory, which earlier versions omitted; test coverage covers the P3 staged totals without claiming SQL execution.

## Eight newly authored 12.02 lesson packages

| ID | Lesson | Runtime regression target |
| --- | --- | --- |
| 12.02.01 | Normalization and denormalization | One-to-many child relation and unique addresses |
| 12.02.02 | Primary and surrogate keys | Stable identity and tenant-scoped unique business key |
| 12.02.03 | Many-to-many relationships | Same member in two projects, duplicate relationship rejected |
| 12.02.04 | Multi-tenant data models | Composite FK refuses cross-tenant project |
| 12.02.05 | Soft delete and history | Archived label reused, active uniqueness and audit history |
| 12.02.06 | Check and unique constraints | Negative stock and case-variant duplicates rejected |
| 12.02.07 | Audit tables | Attempts to UPDATE/DELETE log are rejected |
| 12.02.08 | Bug Hunt missing tenant filter | Beta rows never reach alpha task query |

Each adds MDX lesson + metadata and four lab files (starter.sql, solution.sql, acceptance.sql, lab.json), with a module manifest and disposable SQL fixture. The real-`psql` runner requires explicit opt-in, a local `academy_test` database, and checks **both** instructor success and a named learner starter semantic failure. No production credentials or hosted public database are used.

## Evidence and blockers

Authoring source is committed and source syntax/parity checks are available. **The current environment has Node 22.16 and no local `psql` or PostgreSQL test service, and GitHub/npm DNS from the sandbox is unavailable.** Do not call unexecuted PostgreSQL/Next/Playwright suites green. A human must still review keyboard navigation, screen reader announcements and 200% zoom.

## Next objective

1. On a complete Node24 checkout, run `npm run test:course-roadmap`, `npm run test:publication-phases`, `npm run test:postgresql-modeling-source` and `npm run verify:offline`.
2. Using a disposable PostgreSQL 17+ database, run `npm run qualify:postgresql:12-01` and `npm run qualify:postgresql:12-02`, fixing observed SQL failures.
3. Run full Next build and real Chromium checks, including the new roadmap; collect human accessibility evidence before any lesson publication.
4. Continue source authoring P3 modules 12.03–12.05 without making release metrics misleading.
5. Keep `vercel.json` Git deployments disabled. No GitHub Actions workflow dispatch or Vercel build is needed for source-only development.

The next operator can use `docs/NEXT_TODO.md` as the working handoff. Do not invent green test evidence or increase the published registry just to show progress.
