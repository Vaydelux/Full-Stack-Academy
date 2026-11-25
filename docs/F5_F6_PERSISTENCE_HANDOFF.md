# F5/F6 — persistence qualification infrastructure

Baseline f57c30671090d57fbf0ca10e230831f9dee30e44; scope 889 canonical topics, 338 published. No new live artifacts, dependencies, cloud configuration, or publication approval.

## Parallel P3/P4 source preparation

All 13 module manifests (five PostgreSQL, four Prisma, four Supabase) were retrieved from the baseline and checked against canonical IDs and titles: 104/104 manifest entries. The new plan binds each topic's MDX, metadata, lab manifest, red starter, instructor solution and acceptance asset by SHA-256, plus the module manifest and PostgreSQL fixture where applicable. It checks identity, code-fence parity, evidence categories and false approval flags. Run npm run status:persistence-release for JSON; npm run test:persistence-release runs ten isolated helper tests and the actual checkout source-plan audit. This is wired into the existing P4 offline quality gate.

The PostgreSQL 12.01–12.05 source checks previously rejected legitimate progress beyond 338 published lessons. They now reconcile the actual interactive and MDX inventory with the checkpoint and canonical catalog. The 12.03 manifest/contract explicitly uses single-session-sql-semantics, but its source gate and runner only accepted sql-contract; both now recognize the correct category while retaining separate concurrency qualification.

## Evidence obligations

- 12.01 and 12.02: eight named red/green SQL contracts each.
- 12.03: eight single-session SQL contracts plus eight independent two-session concurrency reviews.
- 12.04: four SQL contracts and four manual workload/maintenance reviews.
- 12.05: two SQL contracts and six manual operations/recovery reviews.
- 13.01–13.04: 32 manual real Prisma toolchain, PostgreSQL integration and authorization contracts. No fabricated npm lock or generated client.
- 14.01–14.04: 32 manual real local Supabase architecture, Auth, RLS, Storage and Realtime contracts; 14.03 and 14.04 require two distinct authenticated users and negative access checks.

Ten isolated Node24.11.1 synthetic fixture tests passed. Actual repository-wide source scan, PostgreSQL execution, Prisma generation, Supabase integration, full Next build, Chromium and human accessibility remain unexecuted. Source fingerprints identify input files, not proof of execution.

## Next executable steps

On an approved networked Node24 clean checkout run npm run test:persistence-release, npm run test:postgresql-drafts, npm run test:postgresql-modeling-source, npm run test:postgresql-p3-source and npm run test:p4-source. Repair observed failures. Use only an opted-in disposable local PostgreSQL 17+ database and the existing qualify:postgresql:12-01, qualify:postgresql:12-02 and qualify:postgresql:p3 gates. Complete the separately specified concurrency and operational proof. Implement and qualify genuine Prisma 7 locked workspaces and a disposable local Supabase stack; never use production credentials or hosted data for red starters. Build per-module publication projections, runnable learner lab wrappers and actual evidence-bound promotion in the existing phase order. Do not infer publication approval from the source plan.

P1 and P2 remain first in publication order. Maintain 338 until a genuine qualified promotion; eventual targets P3=426, P4=490. No deploy or workflow changes.
