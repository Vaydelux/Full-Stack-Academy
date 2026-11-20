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

## Automated, fail-closed module promotion

The publication command is now committed. **Planning is read-only**:

```bash
npm run promote:forms-query:rhf -- --plan
```

Once a real reviewer has completed keyboard, named screen-reader and 200% zoom testing, **committed the truthful `docs/release-evidence/forms-query-09.02-accessibility.json` on the candidate branch** (the promotion tool requires a clean worktree), and a genuine Node24/Playwright checkout exists:

```bash
npm run promote:forms-query:rhf -- --apply
```

Apply performs `npm ci` in both workspaces, full Forms/Query suite and real Chromium checks **before** writing eight published lessons; then atomically prepares 8 live MDX/meta pairs, 8 lab source/test packages, both static registries and the source-derived checkpoint. It reruns the full offline academy quality gate and draft preview browser smoke on the **new published build**. If a step fails, source files and checkpoint roll back; no GitHub merge/deployment is invoked. The resulting local changes must still be reviewed and committed before the published count can change in GitHub.

No execution or approval is claimed for this environment. The `--apply` command must never be used without genuine assistive-technology evidence. **Current published count: 338/889.**

### Publication blockers

1. **Nested runtime boundary:** the genuine nested React/Vite package and npm lockfile already contain React Hook Form 7 and `@hookform/resolvers` 7. Keep those runtime dependencies isolated; the root Next app only renders fenced MDX examples. Both root and nested `npm ci` still need to pass on the exact release candidate.
2. The published stack pin file now records `reactHookForm: "7"` and `tanstackQuery: "5"`. The nested lockfile must remain consistent and pass genuine npm/TypeScript/Chromium runtime checks.
3. Eight browser-backed lab acceptance wrappers exist but have **not executed**. Full academy Next MDX compile, typecheck, existing lab suites and real Chromium navigation must pass at the exact candidate SHA.
4. A named person must complete keyboard, screen-reader and 200% zoom review; candidate metadata has no fabricated approval.
5. Only after the module gate is green, copy candidate MDX/metadata/labs to `src/content/lessons/` and `labs/`, provide an actual reviewedAt and verified nested runtime lock, and atomically update both published registries and checkpoint (target **346/889**, 43 complete modules). Reconcile staged/draft preview logic to avoid duplicate routes. Re-run all release checks after making this promotion.

**Current published snapshot: 338/889, 42 complete modules.** Eight RHF release candidates are structurally assembled, which is genuine engineering progress but **not equivalent to publishing**. The remaining 09.03 TanStack Query lessons are still staged (not candidate-promoted) and must follow the same gated eight-topic process.

**After promotion:** The read-only `--plan` mode reports the module as already published, while `--apply` refuses to reapply. The source-readiness audits support retaining original red/green draft fixtures without double-counting their lesson IDs. Published links replace draft links on the academy project page.

### Pre-release source rehearsal

The release tool now also supports `npm run promote:forms-query:rhf -- --simulate`. This mode calls the **actual eight-lesson generator** in memory, verifies the strict published metadata/lab-contract fields, all eight MDX articles and both generated registries, and reports 50 expected writes **without changing files**. It uses an explicitly fictional schema date `2000-01-01` only in memory; that is not reviewer evidence or publication approval. The normal `--apply` still requires genuine real-world accessibility evidence and Node24/Chromium acceptance.

### Fail-fast JavaScript parse gate

`npm run test:js-syntax` runs real `node --check` on the complete `scripts/` and `tests/` MJS sets plus all eight candidate browser-test entry points, with no package imports or browser execution. It is now the first step of `npm run verify:offline`. This prevents another malformed command-line conditional from surviving until late in the release suite. The current feature-branch source was checked separately using V8 syntax parsing after import stripping; 36/36 changed JS files parsed. **The complete repository Node check and browser runs remain unexecuted here.**

### Accessibility review provenance (source fingerprint)

The `--plan` output now includes `reviewedSourceSha256`: a deterministic hash of the eight release articles, metadata, starter/instructor code, browser acceptance tests, draft and published UI integration code. This is not a secret; it binds a human review to the exact source that was reviewed. The human review JSON must use the same value in `sourceSha256`. If any reviewed file changes, `--apply` refuses that older evidence.

A deliberately **unapproved** example record is available at `docs/release-evidence/forms-query-09.02-accessibility.example.json`. Do not rename it as real evidence until a named reviewer has actually checked keyboard navigation, 200%-zoom layout and a named screen reader across the eight topics. Copy the truthful, completed record to `docs/release-evidence/forms-query-09.02-accessibility.json`, commit it, then execute from a clean worktree. Review artifacts can be committed without changing the fingerprint because the record itself is excluded from the hashed source. The hash authenticates the reviewed artifact version; it does not prove review quality or substitute for a human test.
