# Full-Stack Academy — Finalization contract

Effective 2026-11-25, the curriculum editorial expansion program is complete. The frozen canonical scope is 28 tracks, 111 modules and 889 topic IDs. The source inventory has 338 published unique topics and 551 unpublished manuscripts. The draft for already-published 15.02.04 is retained as a qualification artifact and is not counted again. This is editorial/source completion, not a finished production course.

## Scope guard

`data/curriculum-scope-freeze.json` records the reviewed track IDs, module-to-track assignments and topic-to-module/track assignments. `npm run test:curriculum-readiness` now checks that these assignments remain unchanged, all canonical IDs still have source coverage and no unknown source IDs appear. It permits editorial fixes, ordering changes and legitimate publication progress. This is a regression guard, not an authorization mechanism; changes to the manifest require explicit owner approval. The existing registries and publication checks remain mandatory.

## Allowed work

- Fix factual, technical, accessibility, security and reproducibility defects in existing lessons and labs.
- Build and run genuine red/green exercises and qualification fixtures for existing canonical topics; repair only observed failures.
- Optimize the existing reading-first interface and execution workflow without expanding product scope.
- Promote complete approved modules and update source-derived checkpoints. Do not promote 15.02.04 a second time.

## Release sequence

1. Use a complete clean checkout at the candidate commit with Node 24.9+ (24.x stable), real dependency locks and installed Playwright. Run `npm ci`, `npm run qualify:academy:local -- --plan-p1`, then `npm run qualify:academy:local -- --run-p1` when preflight is clear. Keep exact receipts; never fabricate a lock or test result.
2. Complete P1 human keyboard, zoom and screen-reader reviews. Use the existing guarded module promotion commands; qualify 09.02 then 09.03. Published target 354.
3. Continue the existing publication program: P2 Nest (386), P3 PostgreSQL (426), P4 Prisma/Supabase (490), P5 security/integrations (609), P6 operations/architecture (753), P7 platforms/enterprise/capstone (889). Each promotion requires its applicable real runtime, semantic red/green acceptance, exact candidate evidence and human review. The local coordinator's automated pass is not publication approval.
4. After 889 unique publications, run complete final build, source and runtime checks, responsive browser/a11y acceptance, security review and rollback rehearsal. Deploy only with explicit release approval; keep existing Vercel freeze until then. No GitHub Actions changes needed for local verification.

## Known blockers

Current container Node 22.16.0; direct GitHub clone failed DNS resolution; PostgreSQL and Docker unavailable. Chromium and FFmpeg exist but the full application and actual media exercises have not been qualified. Genuine Nest lock and external provider/device/manual evidence remain required. Historical results do not qualify the final branch. The 40 capstone source checks and commit patch inspections are not runtime passes.
