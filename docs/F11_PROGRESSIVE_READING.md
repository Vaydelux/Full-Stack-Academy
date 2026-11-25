# F11 — Progressive curriculum reading access

## Policy
Reading access and the existing published/completion-eligible lesson registry are distinct. Reading editions retain unverified manuscript warnings, do not imply human editorial approval, do not execute exercises, do not persist quiz or course credit and are not indexed by the published sitemap. Existing published lessons, completion flow, source gates and ordered lab promotion remain unchanged. This is an intentional first implementation of the approved progressive model, not fabricated certification.

## Implementation
- Canonical /learn/<lesson-id> renders the real staged source in a data-only reading component whenever no published article exists. Published content takes precedence. Build static parameters include all distinct published and reading IDs.
- /learn/reading provides a searchable reading-only catalog; curriculum/track navigation links to it or canonical lesson routes. Existing published search and saved-learning catalogs retain their meaning.
- Roadmap displays published registry and reading access separately. Shared manuscript inventory discovers metadata-paired and frontmatter sources across every draft group, excluding historical published IDs. It rejects duplicate/noncanonical IDs, metadata drift, oversized source and symlinked manuscript paths.
- The bounded reader interprets headings, prose, quotes, lists, simple tables, fenced code, and the four recognized teaching blocks using JSON-only attributes. Unknown markup remains literal text. Only absolute HTTPS links without credentials are active. No arbitrary MDX execution, HTML injection, browser lab or persistence. It is deliberately a subset, not full Markdown/MDX; complex nested formatting, escaped table pipes and multiline component syntax may be displayed as source text. Original source remains linked.
- Production file tracing includes lesson manuscripts and paired metadata only; full build is required to verify actual bundling and static routes. Development rescans inventory; production snapshots immutable checkout content in memory.

## Verified and pending
Git tree on baseline 6b76b69be7c13fdf6fc929e55558854599ac285e: 552 distinct regular draft MDX files in 12 groups, largest 16,044 bytes; 15.02.04 is retained historical source. Therefore 551 additional reading candidates and 338 published, potentially 889 readable after a qualified build. Nine targeted parser/inventory tests passed on Node 24.11.1 in an isolated subset. Full-source integration test is wired into mandatory course-roadmap suite but has not run against a complete checkout. No actual React rendering, accessibility, all-article formatting review, full typecheck/build, deployment, lab certification or new published registry entries. DNS still prevents full Git checkout; prior Chromium navigation was blocked. Current production freeze remains in place.

## Next
On a networked complete checkout: npm ci, npm run test:course-roadmap, npm run typecheck, npm run lint, npm run build, then real browser reading-route smoke for each group and manual accessibility review. Fix actual source/rendering issues before deploying the reading edition. Continue the existing lab certification queue separately; do not equate 889 potential readable topics with 889 verified lessons.

Dedicated real browser command after a successful production build: `npm run qualify:reading:browser`. It samples one remaining article per draft group at portrait, landscape and desktop sizes; checks search, noindex, inert article body, progress storage and roadmap count. The runner is implemented but not executed here. File symlink test checks directory junctions on Windows even when file-symlink privilege is unavailable; Windows behavior remains unqualified.
