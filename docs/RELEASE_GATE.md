# Academy reader release gate — 2026-11-18

## Alignment

- Planned syllabus: **28 tracks / 111 modules / 889 topics**; only **4 interactive sample lessons** are authored.
- Reference index: **303 subjects**; **4 reference article drafts** are authored.
- Keep each track in one primary group and preserve subtopics in module order.
- Lessons need the ten-stage authoring quality bar in `COURSE_AUTHORING_STANDARD.md`.
- Progress remains local and self-assessed, not a certificate or tamper-proof grade.
- The current spatial Next.js reader is retained. Migrating to MDX/Fumadocs must preserve interactive sample lessons.

## Hardening in this branch

1. Sandbox uses `sandbox="allow-scripts"` without same-origin; messages verify source and origin.
2. Module asset CORS permits opaque-origin sandbox imports; parent executable code input is bounded.
3. Backup hydration and restore validate completion gates and reference known lesson IDs.
4. Planned lessons show an honest lab/editor placeholder.
5. Shortcuts no longer interfere with focused buttons, links, forms or dialogs.
6. Curriculum track 10 appears in Backend and databases only.
7. CI defines typecheck, lint, Node tests, package validation and Next production build.

## Still needed before production graduation

- Verify live React sandbox in a real deployed browser; check asset CORS and browser console.
- Validate desktop, keyboard-only, and touch-mobile viewport behavior with Playwright.
- Implement stable canonical lesson URLs, reference URLs, metadata and SEO; current one-page workspace is not yet an indexable documentation site.
- Add MDX content tooling, versioned code fixtures, executable/graded lab tests, accessibility audits and lesson editorial QA.
- Before accepting arbitrary untrusted public code, host execution on a dedicated sandbox origin with CSP, quotas and strict network restrictions.
- For multi-device progress, add authenticated server-side progress with explicit privacy/retention policy.
- Do not merge a failed CI change or claim the planned lesson catalog is published content.
