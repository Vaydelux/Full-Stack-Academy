# Full-Stack Academy — verified production release checkpoint

**Updated:** 2026-11-18 (Asia/Manila)  
**Repo:** https://github.com/Vaydelux/Full-Stack-Academy  
**Production:** https://fullstack-academy-ecru.vercel.app/  
**Verified `main` SHA:** `4067cce97beab756526274263231529b7999b96d`  
**Vercel READY production deployment:** `dpl_5m1VbZ11wn8mUC3jaL9eyJyFnzBy`  
**Last curriculum merge:** PR #8 — https://github.com/Vaydelux/Full-Stack-Academy/pull/8  
**PR qualification run:** https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44286064144 — passed. Main push run `44286406423` was active when this checkpoint was prepared; verify independently before claiming its result.

## Production scope confirmed
- Full curriculum catalog: **28 tracks**, **111 modules**, **889 planned lesson/topic IDs**, **303 reference entries**. These catalog totals are not authored publication counts.
- **44 actually authored lesson IDs**: four interactive sample models plus 41 MDX lesson bodies, with one overlapping JSX ID.
- **41 local lab fixture manifests**, four drafted reference entries and **five complete modules**:
  - `00.01` Computing & Internet Mental Models (8/8)
  - `00.02` Developer Toolchain (8/8)
  - `00.03` Learning & Debugging Process (8/8)
  - `01.01` HTML Document Structure (8/8)
  - `01.02` HTML Forms & Validation (8/8)
- Latest release includes eight actual HTML/JavaScript form exercises: labels and fieldsets, native validation, GET submissions, no-script fallback, file picker preview, dialog/popover/details, native events, and inaccessible-form bug hunt.
- Verification on PR head: 18 repository tests, **104 executable lab tests**, **41 MDX/metadata/fixture validations**, machine-checked progress snapshot, ESLint, TypeScript, Next production build, isolated Chromium smoke and dependency audit **passed**.
- Vercel production was READY for merged `main` SHA and the live `/learn/01.02.08` route returned HTTP 200 with indexable published metadata and a completion section. Planned `01.03.01` remains noindex until actually authored.

## Technical architecture and boundaries
Next.js 16 App Router + React 19 + Tailwind 4, trusted repository-controlled MDX, Zustand browser-local self-assessed progress, reusable lesson and reference routes, reading-first navigation and an isolated browser React JSX sandbox. The academy does **not** provide authenticated backend accounts, remote code grading, cross-device progress sync or an implemented Supabase/NestJS service. These technologies are future *teaching topics*, not current academy platform capabilities.

Canonical catalog is in `data/curriculum.json`. Actual publication is in `src/content/lessons/<id>.mdx` and `.meta.json`, wired through `src/lib/academy/published.ts` and `src/content/lesson-registry.tsx`. Every local lab lives in `labs/<slug>/` with starter, solution, tests and lab.json. `scripts/browser-smoke.mjs` tests actual Chromium behavior; static Node tests assert fixture contracts. **Never execute untrusted learner HTML, MDX or arbitrary code on the Next.js server.**

Run `npm run checkpoint:check` to ensure `docs/checkpoint.json` matches the authored inventory; after changing publications run `npm run checkpoint:write`. Keep this checkpoint and `docs/NEXT_TODO.md` synchronized for future AI handoffs.

## Development branch status — 01.03 (not yet production)
- Nine new authored MDX lessons, with standalone HTML/CSS/JS starter and instructor solution fixtures and real Node contract tests. Topics: keyboard, focus, accessibility-tree semantics, WCAG POUR, contrast calculator, names, image alternatives, reduced motion and keyboard audit capstone.
- In-branch inventory is **53 authored lesson IDs, 50 MDX files, 50 local lab manifests, six complete modules**. CI must confirm through `npm run checkpoint:check`.
- Browser smoke was expanded to verify real keyboard behavior, native modal focus return, accessible names, contrast thresholds, original local SVG images, reduced-motion emulation and mobile layout. Actual screen-reader certification remains unperformed.
- Verified production baseline and SHA above are unchanged until release gates and the merged main deployment pass.

## Active security risk
- The last audit found **zero known runtime dependency vulnerabilities**, but **14 high-severity build/dev toolchain findings** related to Picomatch GHSA-fc5q-39xc-vjpf. This is *not patched*. A narrow documented exception expires **2026-12-02 UTC**; see `docs/DEPENDENCY_SECURITY_REVIEW.md`. Review promptly and fail closed for new findings.
- Client-side HTML constraints are educational and cannot replace trusted server validation. All new forms are explicitly synthetic/offline. No production file upload endpoints, registration submission, or remote persistence are implemented.
- Browser smoke covers Chrome behavior, keyboard focus and mobile layout; a full real-device screen reader audit has **not** been completed. Avoid claiming WCAG conformance from structural tests alone.

## Current candidate: `01.03` Accessibility (next after release: `01.04` Web APIs & Security)
The exact **nine** catalog topics:
1. `01.03.01` Keyboard-first navigation
2. `01.03.02` Focus management
3. `01.03.03` Screen reader semantics
4. `01.03.04` WCAG principles
5. `01.03.05` Color contrast
6. `01.03.06` Accessible names and descriptions
7. `01.03.07` Images and alternative text
8. `01.03.08` Reduced motion
9. `01.03.09` Lab keyboard audit

All nine now have genuine MDX, meaningful starter/solution fixtures, executable tests, official source links, bug hunts, quizzes and rubrics **on the feature branch only**. Run the full CI and verify production before marking released. Use actual keyboard and accessibility-tree browser checks; do not invent formal assistive-technology certification.

## Successor AI procedure
1. First read `AGENTS.md`, `docs/NEXT_TODO.md`, `docs/checkpoint.json` and this file. Verify current `main`, open PRs, CI and Vercel SHA; this checkpoint is an anchor, not proof that nothing changed afterward.
2. Branch from the current `main`. Author one complete module at a time, preserving the calm reading-first interface and accurate planned/published distinctions.
3. Register every new authored MDX and metadata, keep planned routes noindex and sitemap restricted to actually published lessons.
4. Update `docs/PROJECT_CHECKPOINT.md`, `docs/NEXT_TODO.md` and run `npm run checkpoint:write`. Commit the generated snapshot.
5. Require npm ci, lint, typecheck, repository tests, curriculum, content, checkpoint, all local labs, build, Chromium, audit and exact-head Vercel preview before merge. Check READY production at the merged SHA afterward. Never fabricate results or credentials.
