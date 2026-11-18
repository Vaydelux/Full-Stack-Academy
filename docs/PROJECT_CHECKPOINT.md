# Full-Stack Academy — Project Checkpoint

**Status:** Production baseline verified; HTML 01.01 release candidate on feature branch · **Updated:** 2026-11-18 (Asia/Manila)  
**Repository:** https://github.com/Vaydelux/Full-Stack-Academy  
**Production:** https://fullstack-academy-ecru.vercel.app/  
**Production main SHA:** `16c2effac03aa47bad666e62fc82b6b8ecc9d48e`  
**Vercel READY deployment:** `dpl_77jkFMZ8grSpsYbiVx6JyTp8phnn`  
**Latest merged work:** PR #4: https://github.com/Vaydelux/Full-Stack-Academy/pull/4  
**PR source CI:** https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44276089359 (passed); main-branch CI: https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44276409479 (verify actual status before claiming).

## What is completed (verified)
- Curriculum map: **28 tracks / 111 modules / 889 topic IDs**. These are topics in the roadmap, **not 889 published tutorials**.
- Published authored lessons: **28** = 4 interactive sample models + 25 MDX lesson files, with one overlapping JSX lesson.
- Local executable lab manifests: **25**. Four authored reference drafts across **303 indexed subjects**.
- Entire Orientation & Computing Foundations track is authored and released:
  - `00.01` Computing & Internet Mental Models — 8/8 lessons.
  - `00.02` Developer Toolchain — 8/8 lessons.
  - `00.03` Learning & Debugging Process — 8/8 lessons.
- Reading-first Next.js/React/Tailwind experience, accessible curriculum navigation, dedicated lesson/reference routes, private local progress, self-assessed quizzes, isolated browser JSX execution, SEO/noindex safeguards.
- Head `4a8ee797` passed lint, strict typecheck, **18 repository tests, 63 executable lab tests, 25 MDX content validations, checkpoint count verification, Next production build and Chromium smoke test**. No additional paid services were required.
- Vercel production is `READY` at the merged SHA, and `/learn/00.03.08` returned HTTP 200 with an indexed authored lesson and a completion section.

## Current architecture (do not assume more exists)
- Next.js 16 App Router, React 19, Tailwind 4, trusted authored MDX, Zustand local progress; npm lockfile; Node 24 CI.
- `data/curriculum.json`: canonical lesson IDs; `data/reference-index.json`: reference subject index.
- `src/content/lessons/<id>.mdx` + adjacent `.meta.json`: teaching content; `src/content/lesson-registry.tsx` and `src/lib/academy/published.ts`: actual publication registration.
- `labs/<slug>`: starter, instructor solution, tests, manifest. Never execute arbitrary student code on the Next.js server.
- Backend teaching architecture (NestJS/Fastify, PostgreSQL/Supabase, Prisma, Zod, Redis/BullMQ) is **not an implemented academy backend**. No cloud grading or multi-device account progress.
- Exact progress snapshot is checked against repository files by `npm run checkpoint:check`. Generate a new snapshot after changing content with `npm run checkpoint:write`.

## Current feature-branch changes (not yet production)
- `01.01` HTML Document Structure: eight new MDX tutorials with eight browser-native, standalone HTML starter/solution labs, local SVG illustrations, and structural + Chromium test coverage.
- Branch authored counts **36 published lesson IDs / 33 MDX files / 33 lab manifests / four complete modules** once CI passes; these are **unreleased** until merged and production deployment verified.
- `docs/checkpoint.json` contains the branch-local publication snapshot and will be checked in CI. The baseline production SHA above remains the last verified release.

## Security and operational notes
- Production `npm audit --omit=dev` reported **zero known advisories** in last review; full audit reported **14 high findings** in dev-only Picomatch dependencies. Not patched. Scoped exception expires **2026-12-02 UTC**, as described in `docs/DEPENDENCY_SECURITY_REVIEW.md`. This remains a P1 obligation; do not forget it.
- GitHub Actions `.github/workflows/academy-quality.yml` runs the primary quality and security gates. Vercel auto-deploys `main`.
- Future work must preserve planned `noindex`, static trusted MDX, and local-first learning. Do not overbuild the layout; prioritize lesson quality and browser accessibility.

## Next milestone — release current HTML 01.01, then begin 01.02
**Feature branch includes `01.01` HTML & Web Platform → Document Structure**, eight exact catalog IDs:
`01.01.01` HTML document anatomy; `01.01.02` Head and metadata; `01.01.03` Semantic landmarks; `01.01.04` Heading hierarchy; `01.01.05` Text lists and quotations; `01.01.06` Links and navigation; `01.01.07` Images and responsive media; `01.01.08` Lab accessible content page.

Each new lesson now has an MDX tutorial, official sources, meaningful exercise, starter/solution tests, validated metadata and navigation. **CI/browser checks, preview and production deployment are pending.** After releasing this module, the next one is `01.02` HTML Forms & Validation. Follow the ordered checklist in `docs/NEXT_TODO.md`.

## Handoff protocol for another AI
1. Read `AGENTS.md` and `docs/NEXT_TODO.md`, then inspect **current** `main`, open PRs, last CI run and Vercel deployment. This snapshot is a historical commit anchor, not proof that the repository has not changed since.
2. Branch from current `main`. Work one module at a time; do not label planned entries authored.
3. After all code and tests, run `npm run checkpoint:write`, update this checkpoint and task list, and commit all three.
4. Do not merge before audit, lint, typecheck, repository tests, catalog/content/checkpoint validation, lab tests, production build, Chromium smoke, and preview review all pass.
5. After merge, verify actual production SHA and update the checkpoint again. Do not invent a completed check or share production credentials.
