# F9.4 — Remaining persistence review projections

The unified publisher now supports review-only projections for all 13 P3/P4 modules: 104 lessons (16 from F9.1 and 88 additional). F9.4 covers 12.03–12.05, 13.01–13.04 and 14.01–14.04. No live article, registry, checkpoint, dependency or deployment changed. Published remains 338/889; 09.02 is first.

## Commands
    npm run publish:academy -- --check-projections
    npm run publish:academy -- --project 12.03
    npm run publish:academy -- --project 13.01
    npm run publish:academy -- --project 14.03
    npm run publish:academy -- --check-review-evidence 14.03 PATH_TO_EXPORTED_DIRECTORY

The check builds projections in memory. Each individual export creates a new external temporary review directory, manifest with current HEAD, original and projected source fingerprints, output/preimage hashes, canonical order eligibility and 59 proposed files. Extended modules additionally receive a blank evidence.json and artifacts directory. Use the source checkout for genuine runtime commands, not the overlay. The manifest binds current HEAD; changes require regeneration and review.

## Exact scope
- 12.03: eight wrappers execute the named SQL red/green pair AND the independent two-session concurrency case.
- 12.04/12.05: six additional SQL wrappers execute their named contracts. Ten manual topics deliberately fail the proposed test until their exact runtime contract is implemented; the F9.3 performance and logical restore commands are supplemental only.
- 13.01–13.04: 32 Prisma review projections, with manual topic-specific toolchain/integration obligations and existing Prisma vertical as supplemental exercise.
- 14.01–14.04: 32 Supabase review projections, with manual local/auth/RLS/storage-realtime obligations. All 16 RLS and Storage/Realtime topics explicitly require two authenticated users. Existing local Supabase vertical is supplemental only.

Original draft warnings, starter, solution and acceptance text are retained. No actual LabGate is generated in extended overlays. This is deliberate: the current live validator requires LabGate, and a review overlay must not be accidentally publishable. Manual wrappers fail nonzero, not skip or green. Synthetic metadata review date 2000-01-01 is for proposed shape only, not actual approval. The overlays are not applicable patches or full production build candidates. The existing 12.01/12.02 guarded lifecycle is unchanged; 12.03–14.04 have no apply path. Actual source validators, runner classification, TS exclusions and browser acceptance must be reconciled before future apply support.

## Evidence
For each of eight topics, record distinct positive and negative observations, actual human editorial/keyboard/screen-reader/200% zoom/contrast/responsive review, and an artifact per required obligation. Use sanitized logs named artifacts/<lesson-id>.<obligation>.log. Fill the SHA-256 fields with hashes of the actual bytes. Do not include credentials, real user data or invented observations. The checker derives expected obligations from current source, checks exact HEAD/manifest and overlay bytes, rejects symlinks and oversized evidence, requires matching topic/acceptance/projection fingerprints and distinct nonempty artifact bytes. It verifies integrity and structure only, never evidence authenticity, runtime qualification or publication approval. Human examination is still necessary.

## Verification
Six targeted Node24.11.1 fixture tests passed: 11 module shapes/88 lesson fixtures, original code fences, 14 executable SQL and 74 fail-closed manual wrappers, actual nested Node child nonzero exit (parent NODE_TEST_CONTEXT removed), source/registry drift, topic-specific obligations, per-obligation byte hash verification, missing/changed/reused artifacts and incomplete review rejection. These are fixture tests, not full actual manuscript projection or a production build. Real PostgreSQL, Prisma, Supabase, npm dependency installation and accessibility gates remain unrun in this environment. No connected service modified.

## Next
Stop adding more projection-only tooling. First run actual full checkout validation and the earliest P1 browser/review gate, then P2. For P3 extend the existing guarded apply flow to 12.03 with actual dual runtime receipts; 12.04/12.05 require actual manual/runtime contracts before apply. For P4 implement genuine topic-specific acceptance adapters rather than replacing a manual gate with an unrelated module-wide passing test. Retain ordered publication and production freeze.
