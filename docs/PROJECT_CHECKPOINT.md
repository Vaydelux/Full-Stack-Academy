# Full-Stack Academy — verified release checkpoint

**Updated:** 2026-11-18 (Asia/Manila)  
**Production:** https://fullstack-academy-ecru.vercel.app/  
**Repository:** https://github.com/Vaydelux/Full-Stack-Academy  
**Last verified production main:** `2e11d08544a466a0ee1528bba896f219c59a72f7`  
**Vercel deployment:** `dpl_ATN8vMstSCqfAUK91JyjXpY8uGtF` · READY  
**Latest curriculum PR:** https://github.com/Vaydelux/Full-Stack-Academy/pull/6 · merged  
**Source CI for released code:** https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44279720886 · passed (post-merge push run 44280094770 should also be checked)

## Verified current publication state
- 28 curriculum tracks, 111 modules, 889 named catalog topics. These are planned curriculum slots, not 889 published lessons.
- **36 authored lesson IDs**, consisting of 4 authored interactive sample lessons and 33 MDX bodies with one overlapping JSX entry.
- **33 executable lab manifests**, **4 authored reference drafts** across **303 indexed reference subjects**.
- Four fully authored 8-lesson modules:
  - `00.01` Computing & Internet Mental Models
  - `00.02` Developer Toolchain
  - `00.03` Learning & Debugging Process
  - `01.01` HTML Document Structure
- Latest PR verified 18 repository tests, **80 runnable lab tests**, **33 MDX metadata/fixture validations**, checkpoint match, lint, strict TypeScript, Next production build and Chromium browser verification.
- Verified Vercel preview: all eight `/learn/01.01.0x` routes HTTP 200 with indexable metadata and completion controls; sitemap includes new lessons. Planned `/learn/01.02.01` remains `noindex`. Production `/learn/01.01.08` returned HTTP 200 with completion controls.
- The HTML module has genuinely standalone `index.html` starter and solution documents, local original SVG assets, Node structural contract tests and Chromium checks for keyboard skip link, desktop responsive art direction and mobile overflow.

## System architecture / scope
Next.js 16 App Router, React 19, Tailwind 4, trusted repository-reviewed MDX and local self-assessed Zustand progress. Reading-first design; dedicated lesson/reference routes, searchable curriculum, accessible mobile and desktop layouts, isolated browser JSX sandbox. No account sync, NestJS backend, cloud grading service or arbitrary learner HTML evaluation on the academy server is implemented. Backend and database stacks appear as *subjects to teach*, not already deployed platform services.

Canonical data: `data/curriculum.json`, `data/reference-index.json`. Published lessons: `src/content/lessons/<id>.mdx` + `.meta.json`, `src/content/lesson-registry.tsx`, `src/lib/academy/published.ts`. Labs: `labs/<slug>/lab.json` with starter/solution/tests. `npm run checkpoint:check` checks the inventory; `npm run checkpoint:write` refreshes `docs/checkpoint.json` when lessons publish. `.github/workflows/academy-quality.yml` enforces audit, lint, typecheck, repository tests, curriculum/content/checkpoint verification, lab tests, production build and Chromium smoke.

## Open risks / constraints
- **Security review by 2026-12-02 UTC:** 14 high development-only dependency findings from the Picomatch advisory `GHSA-fc5q-39xc-vjpf`. `npm audit --omit=dev` reported zero known runtime findings at last review. A narrowly scoped temporary exception is in `docs/DEPENDENCY_SECURITY_REVIEW.md`; the issue is **not patched**.
- Content inventory remains early-stage: 36 of 889 planned lesson IDs authored; 4 of 303 reference subjects drafted. Planned content must never look complete or be indexed.
- Progress is browser-local/self-assessed, not authenticated or cross-device. Lab acceptance tests verify instructor fixtures and developer-edited starters locally; they do not prove all human exercise steps were performed.
- Browser CI tests desktop/mobile and basic keyboard semantics; they do not replace a manual assistive-technology audit on real devices.
- The historical README header still says v1.1; reconcile the old narrative when convenient without making branding or layout a release blocker.

## Current feature branch — Module 01.02 (unreleased)

- Eight additional MDX lessons and local HTML/JS starter/solution projects covering labels, constraints, native submission, progressive enhancement, file inputs, dialog/popover/details, form events and an accessibility repair capstone.
- In-branch provisional counts: **44 authored lessons, 41 MDX files, 41 lab manifests and five complete modules**. These values will be confirmed by `npm run checkpoint:check` and CI. The production SHA above remains unchanged until merge and deployment verification.
- Real Chromium checks now cover native constraint validation, accurate local submission messages, no-JavaScript fallback, safe file metadata previews, modal keyboard behavior and responsive form interactions.
- The next catalog module is `01.03` Accessibility (nine topics), but do not start it before qualifying and releasing 01.02.

## Immediate next milestone: `01.02` HTML Forms & Validation
The eight canonical topics from `data/curriculum.json`: `01.02.01` Labels controls and fieldsets; `01.02.02` Input types and validation; `01.02.03` Buttons and form submissions; `01.02.04` Progressive enhancement; `01.02.05` File inputs; `01.02.06` Dialog popover and details; `01.02.07` Native events and default behavior; `01.02.08` Bug Hunt inaccessible form. See `docs/NEXT_TODO.md` for acceptance criteria and release gates.

## AI / Engineer handoff procedure
1. Read `AGENTS.md`, this checkpoint, `docs/NEXT_TODO.md` and `docs/checkpoint.json`. Verify current `main`, active PRs, latest green CI and READY deployment; this snapshot is a historical anchor.
2. Create a feature branch from current `main`; implement **one full module at a time**, with actual MDX, strict metadata, runnable starter/solution, tests, official links, quizzes, bug hunts, and an honest rubric for each lesson.
3. Register every authored lesson in both published metadata and MDX component registries. Keep planned route `noindex`, sitemap limited to genuine authored content, and avoid arbitrary user code on the server.
4. Update this checkpoint and `docs/NEXT_TODO.md`; run `npm run checkpoint:write` and commit `docs/checkpoint.json`.
5. Validate audit, lint, typecheck, npm tests, catalog/content/checkpoint, all labs, production build, Chromium and Vercel preview before PR merge. After merging, verify production SHA and READY status and reconcile the checkpoint again. Never invent tests, references, data or secrets.
