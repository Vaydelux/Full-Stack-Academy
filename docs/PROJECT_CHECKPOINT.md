# Academy Project Checkpoint

**Checkpoint date:** 2026-11-18 (Asia/Manila).  
**Last verified production baseline:** `main` at `cd7f33bb0c524887c8b6e05a8dd2c90867fd6439`; Vercel production deployment `dpl_7u1f3atULEvoE1tmNX2bokzXCJBB` was **READY**.  
**Development branch:** `feat/learning-debugging-checkpoint` (work in progress; NOT a production release).

## Goal and boundaries
Enterprise-quality, accessible, reference-driven, hands-on Full-Stack Engineering Academy. Keep a simple reading-first user experience, progressively disclosed practice/notes, and topic/subtopic course structure. Do not mistake a catalog's **planned** topics for completed tutorials.

## Verified production baseline
- Curriculum: 28 tracks / 111 modules / 889 topic IDs. Reference index: 303 subjects.
- Published: 20 authored lessons = 4 interactive models plus 17 MDX lesson bodies with one overlapping JSX lesson; 16 local foundations/toolchain labs + one JSX lab = 17 lab manifests.
- Modules `00.01` (computing/internet) and `00.02` (developer toolchain) fully authored; `00.03` not authored at baseline.
- Four drafted technical reference articles (Zod safeParse, Prisma transaction, Nest guards, Redis SET).
- PRs #1, #2, #3 merged. Latest production verification: GitHub Actions run `44243836026` success.
- App: Next.js/React/Tailwind, static trusted MDX, independently indexed course and reference routes, Zustand local progress, no required backend.
- Responsive reading-first workspace, isolated browser JSX preview, server-side routes for published MDX, planned pages `noindex`, sitemap excludes unpublished lessons.
- Dependency review: no known runtime vulnerabilities in audit; **14 dev-only high alerts** trace to Picomatch advisory, explicitly accepted only through **2026-12-02 UTC**. See `docs/DEPENDENCY_SECURITY_REVIEW.md` and audit job. **Not patched.**

## Active milestone
`00.03` Learning & Debugging Process: eight exact catalog IDs `00.03.01`–`00.03.08`. Add meaningful, runnable local labs and step-by-step MDX; register; verify; do not merge ahead of tests. See `docs/NEXT_TODO.md`.

## Source of truth
- Machine-checkable counts and release details: `docs/checkpoint.json`, checked by `npm run checkpoint:check`.
- Lesson IDs and topic names: `data/curriculum.json`. Reference subjects: `data/reference-index.json`.
- Published lesson imports: `src/content/lesson-registry.tsx`; metadata: `src/lib/academy/published.ts`.
- Lab fixtures: `labs/*/lab.json` plus `starter/`, `solution/`, `solution.test.mjs`.
- Production/CI: `.github/workflows/academy-quality.yml` and Vercel project for `Vaydelux/Full-Stack-Academy`.

## Known limitations and debt
1. Only local, self-assessed progress. No signed grading or multi-device sync.
2. Content volume is early-stage; the next most useful task is finishing the **full module** rather than claiming whole-course completion.
3. Existing `README.md` carries older v1.1 descriptions and should eventually be condensed/reconciled with these canonical handoff docs.
4. Existing MDX registry is manual; consider typed generated registration only after thorough migration/test coverage.
5. User-generated/remote MDX and untrusted code must never execute on the Next.js server. Sandbox origin isolation and browser verification remain release gates.

**When work resumes:** check current `main`, active PRs and green CI, then use `docs/NEXT_TODO.md`. Explicitly update this checkpoint with new release SHAs and evidence; do not copy stale values forward.
