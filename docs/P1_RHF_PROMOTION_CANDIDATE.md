# RHF 09.02 — eight module publication candidates (2026-11-20)

The next eight lessons have been assembled as **non-live** reviewable bundles under `release-candidates/forms-query/09.02/`. These are candidate artifacts, not the public curriculum or a released module. No production code or user progress is changed by these files.

### Source-ready assets

For all eight canonical IDs 09.02.01–09.02.08:

- Candidate MDX with the eventual `LabGate` and registered command text, retained two TSX examples, three guided steps and original official sources.
- Candidate metadata projection in the strict published field shape, with `reviewedAt: null` to prevent fabricated reviewer approval; the outer wrapper says `publicationReady: false`.
- Candidate lab assets: identical red starter and instructor TSX, a proposed final manifest, and real browser-backed `solution.test.mjs` per topic.
- A dedicated module browser runner at `scripts/verify-rhf-release-browser.mjs` that supports `--lab <slug>`, uses unique loopback Vite/API ports, and calls existing real-library positive and intentionally failing starter checks.
- A source-only audit `npm run test:forms-query-rhf-candidates`; `node scripts/verify-forms-query-rhf-candidates.mjs --strict` must **fail** until live release gates complete.

### Actual qualification commands

```bash
npm ci
npm ci --prefix examples/forms-query-vertical/react-client
npm run test:forms-query-rhf-candidates
npm run test:forms-query-rhf-browser-gate
npm run test:forms-query-p1-source
npm run qualify:forms-query:rhf-browser
npm run qualify:forms-query:preview-browser
npm run verify:offline
npm run qualify:forms-query:full
```

The Playwright setup uses `ACADEMY_BROWSER_ROOT` for an isolated browser installation and can optionally use `ACADEMY_CHROME_BIN` for an installed local Chromium executable. The focused browser gate now allocates loopback ports dynamically; it does not call hosted CI or Vercel. These commands are **authored, not executed** in this environment (Node22, no npm/GitHub DNS or installed React/Playwright). Real human keyboard navigation, named screen reader, 200% zoom, contrast and responsive review must also be recorded.

### Publication blockers

1. The root Next.js dependencies and **genuine root npm lockfile** still lack React Hook Form 7 and `@hookform/resolvers` 7; never synthesize registry integrity hashes.
2. The published stack pin file needs both `reactHookForm: "7"` and `tanstackQuery: "5"`; root-lock compatibility must be qualified.
3. Eight browser-backed lab acceptance wrappers exist but have **not executed**. Full academy Next MDX compile, typecheck, existing lab suites and real Chromium navigation must pass at the exact candidate SHA.
4. A named person must complete keyboard, screen-reader and 200% zoom review; candidate metadata has no fabricated approval.
5. Only after the module gate is green, copy candidate MDX/metadata/labs to `src/content/lessons/` and `labs/`, provide actual reviewedAt and an integrated root dependency lock, and atomically update both published registries and checkpoint (target **346/889**, 43 complete modules). Reconcile staged/draft preview logic to avoid duplicate routes. Re-run all release checks after making this promotion.

**Current published snapshot: 338/889, 42 complete modules.** Eight RHF release candidates are structurally assembled, which is genuine engineering progress but **not equivalent to publishing**. The remaining 09.03 TanStack Query lessons are still staged (not candidate-promoted) and must follow the same gated eight-topic process.
