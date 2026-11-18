# Full-Stack Academy — Release and QA gates (2026-11-18)

## Current publication truth

- **Curriculum plan:** 28 tracks, 111 modules, 889 topic IDs. Only **61** lessons are published, spanning **7 complete modules**. Catalog entries are not authored pages.
- **Content:** 58 MDX files, four interactive models (one overlapping ID), 58 offline local lab fixtures.
- **References:** 303 indexed subjects; four authored drafts. Do not confuse index coverage with completed articles.
- **Runtime:** Next.js App Router, compile-time trusted MDX, sandboxed local JSX teaching environment. No authenticated synced progress or remote arbitrary-code grading.
- **Progress:** browser-local and self-assessed, not a certificate or tamper-resistant assessment.

## Every candidate must pass

1. Confirm `main`, open PRs, source-of-truth curriculum IDs and last verified app-release SHA.
2. Author each canonical lesson with metadata, 3+ guided runnable steps, predictions, self-check and misconception, bug hunt, official HTTPS citations, real local lab starter+solution+tests, an honest rubric.
3. Register `.mdx` and `.meta.json` in both publication registries; keep planned lessons `noindex`, excluded from sitemap and unavailable for completion claims.
4. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run validate`, `npm run verify:content`, `npm run checkpoint:check`, `npm run test:labs`, `npm run build`, and isolated Chromium smoke on the PR HEAD.
5. Run `npm run audit:dependencies`: runtime critical/high must fail; scoped temporary dev advisory exception must be reviewed by its expiry date.
6. Verify exact-head Vercel preview READY and check hosted published routes, robots metadata, sitemap and representative browser behavior. Do not treat a READY build alone as interactive usability certification.
7. Review diff, security changes, unresolved threads and scoped exceptions; merge only after required gates pass. Confirm main CI, production deployment SHA and live route behavior after merge; update the handoff checkpoint.

## Known residual risks and nonclaims

- The **14 dev-only Picomatch high findings** are not fixed. The controlled exception expires 2026-12-02 UTC (see `docs/DEPENDENCY_SECURITY_REVIEW.md`).
- Chromium smoke is not a physical-device manual screen-reader audit nor formal WCAG 2.2 certification.
- Do not compile untrusted user-submitted MDX or run arbitrary learner code on the trusted Next.js origin. Keep iframe opaque-origin isolation, bounded messages and explicit source/origin checks.
- Do not claim client-only preview messages reflect persisted submissions or real backend acknowledgments.
- Keep the reading-first navigation and keyboard behavior; do not replace the MDX reader or alter branding during curriculum milestones.

## Last verified application release

[PR #12](https://github.com/Vaydelux/Full-Stack-Academy/pull/12) merged Module `01.04`; application release commit `394e6d0f620f4740912b0d50cbcbbf5aecc83e8e`; post-merge [CI 44321173715](https://github.com/Vaydelux/Full-Stack-Academy/actions/runs/44321173715) successful; production deployment `dpl_5CsySTxdf8iRD2zQ1wpL4xcTBstX` READY; hosted published routes and planned noindex/sitemap boundaries verified.

Read `docs/PROJECT_CHECKPOINT.md` and `docs/NEXT_TODO.md` before starting `02.01 — CSS Fundamentals`.
