# F15 — Backend and production engineering reference expansion

Added 63 authored reference drafts across NestJS, PostgreSQL, Prisma ORM 7, Supabase JS v2, Redis/BullMQ, and testing/operations. New entries include API semantics, minimal and applied illustrative examples, failure modes, security/performance boundaries and canonical lesson links. They use the F13 relationship graph and F14 coverage UI. No new indexed subjects, lesson promotions or lab certifications.

- NestJS: +8
- PostgreSQL: +16
- Prisma: +10
- Supabase: +6
- Redis & BullMQ: +13
- Testing & Operations: +10

## Current coverage
- Web & HTML: 13/34, 21 remaining
- CSS: 17/23, 6 remaining
- JavaScript: 14/25, 11 remaining
- TypeScript: 12/22, 10 remaining
- React: 13/22, 9 remaining
- Next.js: 6/24, 18 remaining
- NestJS: 16/20, 4 remaining
- Zod: 19/19, 0 remaining
- PostgreSQL: 22/27, 5 remaining
- Prisma: 14/24, 10 remaining
- Supabase: 10/17, 7 remaining
- Redis & BullMQ: 18/25, 7 remaining
- Testing & Operations: 14/21, 7 remaining

## Evidence and boundaries
Actual new records passed existing source-quality validation in the connector JavaScript runtime. Three new full-checkout integration cases are wired into test:p8-reference; not yet executed by Node. Prisma 7 Client, Supabase password sign-in/getUser/signOut/signed download and BullMQ retry/deduplication behavior were checked against relevant official documentation excerpts; the Supabase markdown changelog fetch failed. Not every linked URL or code snippet was independently verified or executed. All examples remain drafts and may require configured services and local imports. No live service writes, deployment, dependency or publication registry changes. Full checkout, locked Node 24 build, typecheck, lint, browser and runtime verification still required. Keep draft PR unmerged.

## Qualification follow-up
The 63 committed JSON-shaped F15 records were independently re-extracted and validated with the actual canonical index and curriculum. Registry reconciliation: 188 unique authored drafts, 212 distinct explicit links across 138 curriculum topics, no unknown graph targets or unlinked authored drafts. All three new F15 test bodies passed in the connector V8 runtime using extracted registry data and a minimal assertion adapter; this is not the full TypeScript-import Node suite. Six existing quality-gate tests passed in Node 22.16.0 after reconstructing files whose exact Git hashes match `cbfcc824e61c010b91954e3d13a2da98295d0cb9` and `a9387efcf84557ee3a9b25cfbf80bd485e88ee1b`. A follow-up revision makes the transaction audit write conditional on the actual updated row, using a data-modifying CTE. The final batch was revalidated structurally; SQL was not executed. Local `git ls-remote` still fails DNS resolution for github.com. No full checkout, locked build, browser or external source link qualification. Preserve production freeze.
