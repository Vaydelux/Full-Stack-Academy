# P7 final manuscript authoring and publication handoff

**2026-11-24 | Source authoring milestone | No publication or deployment**

## Scope
136 new topic-specific draft manuscripts: Track 24 platforms and offline data (32), Track 25 specialized data and media (32), Track 26 enterprise identity/billing/privacy/administration (32), Track 27 graduation capstone (40). Seventeen modules of eight lessons. Each draft contains a scenario, concept, guided practice, positive and negative targets, model command, reference, qualification boundary and assessment. References are not independently link-checked. These are concise instructor manuscripts requiring editorial expansion and real executable labs, not finished learner-facing lessons.

The prior P1–P6 source inventory plus P7 now covers 889 canonical topics, 28 tracks and 111 modules. 338 published unique IDs, 551 unpublished drafts, zero missing canonical topics. Historical manuscript 15.02.04 overlaps a published topic and is counted once. No lesson was promoted.

## Actual executed tests
Node v22.16.0 isolated local directory: **53/53 passed**, comprising 42 model tests and 11 synthetic auditor mutation tests. Exact Git blobs:
- labs.mjs: f71cee2b969a9fb1068fb8002b2c140fb81f4ca9
- labs.test.mjs: 191ed6f16c5e878f7561c570ed3f7efc6dab90f3
- verify-track.mjs: af4f7bccfe47731719fb40792da14ce3e7f40455
- verify-track.test.mjs: 921242ff2e23b58e61e6fb48f80a4ce48efd063f

The repository source gate `test:p7-source` is wired into `verify:offline` and the release matrix now requires all three P6/P7 groups. Full repository execution is unverified: direct Git clone DNS failure; Node24, PostgreSQL and Docker unavailable. The P7 auditor's real-manuscript CLI and modified whole-release matrix tests require the complete checkout. No real Android/iOS/Tauri artifact, SQLite restart, warehouse/vector/PostGIS database, AI/provider, FFmpeg/WebRTC, enterprise identity, billing or legal compliance acceptance was executed. No actual capstone application was built. See `docs/CAPSTONE_PROJECT_SPECIFICATION.md` for the capstone project and acceptance requirements.

## Next work — qualification, not bulk manuscript expansion
1. Use stable Node 24.9+ in 24.x, Git, Python and installed Playwright; run `npm run qualify:academy:local -- --plan-p1`. Fix actual blockers and run `--run-p1`.
2. Improve 09.02 and 09.03 learner-facing explanations and red/green fixtures; collect actual browser and manual accessibility evidence. Perform reviewed module-atomic promotion using established publication workflow.
3. Resolve genuine NestJS npm lockfile and installed runtime/DB integration, then progress sequentially through P2–P7. Do not fabricate lockfiles or provider evidence. Review all module-specific references against current official docs.
4. Maintain actual security advisory review, privacy boundaries and deployment freeze. Full publication is a distinct milestone; no source-only test authorizes it.

No GitHub Actions, dependency locks, published registries, or Vercel configuration changed.
