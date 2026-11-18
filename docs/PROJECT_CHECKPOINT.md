> **Unreleased candidate — feature branch feat/01-04-web-apis-security (2026-11-18).** The production verification below still describes the previously verified main deployment, NOT this new content. Eight 01.04 Web APIs & Security lessons and eight labs are committed on a feature branch; registries, lint, typecheck, content validation, local lab tests, Chromium, dependency audit, Next build, and exact-head Vercel preview must pass before merging. Candidate counts: 61 published lesson IDs, 58 MDX files, 58 lab fixtures and seven complete content modules. Manual accessibility and assistive-technology verification remain unperformed. See docs/NEXT_TODO.md for the pending release gates.

# Full-Stack Academy — Verified Project Checkpoint

**Verified date:** 2026-11-18 (Asia/Manila)  
**Repo:** https://github.com/Vaydelux/Full-Stack-Academy  
**Live:** https://fullstack-academy-ecru.vercel.app/  
**Verified production main:** `ae2211354e6f96d2cc731537a1d489cdee72750c`  
**Vercel READY deployment:** `dpl_2ZeCD6utrwhsiUegYkydU7fb9fkT`  
**Curriculum merge:** PR #10 — https://github.com/Vaydelux/Full-Stack-Academy/pull/10  
**CI:** [PR head run 44292336961](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44292336961) and [post-merge main run 44292786322](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44292786322) — both passed.

## Scope verified
- Planned curriculum (not authored pages): **28 tracks**, **111 modules**, **889 topic IDs** and **303 reference index subjects**.
- Actually authored: **53 lesson IDs** = 4 interactive sample models plus 50 MDX lesson bodies with one overlapping JSX ID; **50 local lab fixtures** and **4 authored reference drafts**.
- Six fully authored and released modules:
  - `00.01` Computing & Internet Mental Models — 8 of 8
  - `00.02` Developer Toolchain — 8 of 8
  - `00.03` Learning & Debugging Process — 8 of 8
  - `01.01` HTML Document Structure — 8 of 8
  - `01.02` HTML Forms & Validation — 8 of 8
  - `01.03` Accessibility Foundations — 9 of 9
- Latest verified PR: **18 repository tests**, **131 local lab tests**, **50 MDX content/metadata/fixture validations**, checkpoint consistency, lint, TypeScript, Next.js build, isolated Chromium smoke and audited dependencies all passed.
- Live `/learn/01.03.09` returned HTTP 200, included completion controls and was indexable. Preview showed all nine lesson URLs, matching sitemap, with `01.04.01` planned/noindex.

## Accessibility module details
New lessons cover keyboard-first navigation, modal focus restoration, semantic landmarks and status, WCAG 2.2 POUR principles, a **tested gamma-corrected sRGB contrast calculator**, named controls and descriptions, original local image alternatives and table, reduced-motion CSS plus pause control, and integrated keyboard audit repair.

**Important limit:** these are structured learning fixtures with automated Chromium interactions, not a full independent WCAG conformance assessment. Screen-reader behavior varies by platform, and real-device assistive-technology checks have **not** been completed. Do not claim the academy is WCAG certified.

## Architecture and guardrails
Next.js 16 App Router, React 19, Tailwind 4, compile-time trusted MDX, Zustand browser-local self-assessed progress, isolated JSX preview sandbox and local-only HTML practice. There is **no** implemented authenticated academy backend, cross-device saved progress, cloud grading, real form upload or arbitrary learner-code execution on Next.js. Next.js, NestJS, Supabase, Prisma and related technologies are planned *teaching tracks*, not all current platform services.

Source of truth:
- `data/curriculum.json` — all catalog IDs
- `data/reference-index.json` — reference subjects
- `src/content/lessons/<id>.mdx` and `.meta.json` — genuinely authored tutorials
- `src/content/lesson-registry.tsx` and `src/lib/academy/published.ts` — published route and metadata registration
- `labs/<slug>/` — local starter, instructor solution, test and lab manifest
- `scripts/browser-smoke.mjs` — Chromium behavior
- `docs/checkpoint.json` — `npm run checkpoint:check` verified machine-readable count

Never compile untrusted remote/learner MDX on the server, claim submitted data is persisted without real backend acknowledgment, or label unauthored catalog topics published.

## Known risk and tasks
- Development-only Picomatch dependency advisory `GHSA-fc5q-39xc-vjpf`: **14 high findings in full dev graph**, scoped temporary security exception expiring **2026-12-02 UTC**. **Not resolved yet.** Last runtime-only audit found **zero known findings**. See `docs/DEPENDENCY_SECURITY_REVIEW.md`.
- Publication covers 53 of 889 planned topics, and four of 303 reference subjects are drafted; do not confuse index coverage with authored content.
- No real-device screen reader audit, independent accessibility certificate, authenticated sync, or remote code execution grading.
- Historical README v1.1 descriptions still need consolidation without crowding the UI.

## Next milestone `01.04` — Web APIs & Security
Eight canonical topics, in exact order: `01.04.01` DOM and rendering tree; `01.04.02` Fetch API and JSON; `01.04.03` URL and URLSearchParams; `01.04.04` Web Storage and cookies; `01.04.05` Permissions and clipboard; `01.04.06` Same-origin policy and CORS; `01.04.07` CSP and browser isolation; `01.04.08` Lab DevTools request investigation.

Prefer deterministic local fixtures that **do not** fetch real user data or ask learners to bypass origin/permission security. Teach browser security distinctions accurately. Read `docs/NEXT_TODO.md` for detailed criteria.

## Instructions to the next AI
1. Read `AGENTS.md`, this checkpoint, `docs/NEXT_TODO.md`, `docs/checkpoint.json`, `docs/DEPENDENCY_SECURITY_REVIEW.md`.
2. Recheck current GitHub `main`, open PRs, CI and Vercel READY SHA; this checkpoint is a historical anchor, not proof nothing changed afterward.
3. Branch from current main; author a **complete module** with MDX, strict metadata, 3+ guided steps, quiz, bug hunt, W3C/MDN sources and a meaningful local starter/solution/tests for each topic.
4. Register each new authored MDX and metadata in both registries, keep unauthored routes noindex and sitemap limited to truly published material. Maintain the reading-first non-overwhelming UI.
5. Update this checkpoint, `docs/NEXT_TODO.md` and run `npm run checkpoint:write`; commit the machine-readable snapshot.
6. Require dependency audit, lint, typecheck, repository/content/checkpoint/fixture tests, production build, Chromium and Vercel preview on exact head. Merge only on green. Confirm production READY on merged SHA and update the checkpoint. Disclose any unperformed device/manual checks.
