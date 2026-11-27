# Consolidated large-scope release batch — P1 through P4

## Actual inventory
The source tree contains 338 unique published IDs and 552 draft manuscripts, including one overlapping published topic (15.02.04). Their union is 889 unique lesson IDs; 551 remain reading-only. Source existence does not demonstrate correctness, runtime readiness, or publication approval.

## Consolidated qualification
- P1/P2: run 46004962832 passed both jobs on 780f8de; detached 386 fixture and 426 source projection. No human evidence claimed.
- P3: run 46059952393 failed both jobs before SQL execution because Ubuntu did not locate postgresql-client-17. Configure the official signed PGDG repository for Ubuntu noble and verify its known primary key fingerprint; use installed version-17 binaries if available. Rerun the independent runtime and 410-fixture gates.
- P4: qualified Prisma 7.10.1 with Effect 3.22.1, run 46005862585, zero reported npm findings and real migration/CRUD. Exact lock committed e1b32dd; SHA-256 6224c119f414d23df5ad20ccfe69df33b60022ba331006408e6b36eb4177ee7c. Supabase three supplemental suites passed 46023296091. Source audit 46007746465 passed. Bring the 29 exact P4 changed blobs into this review branch without conflict. This is a source integration, not new evidence for the integrated head.

## Batch release policy
Use P1+P2 as one 48-lesson release candidate, P3 SQL as one 24-lesson candidate, P3 operations and P4 as a 80-lesson review queue. Do not repeat already proven component experiments unless source/dependency drift requires it. Preserve exact existing runtime evidence and requalify the integrated candidate as needed. Do not invent editorial or accessibility signoff. Existing promotion scripts intentionally require named human observations; changing to an automated-qualified public release tier is a product-policy decision, separate from publication and deployment. Formal inventory stays 338 until actual guarded apply.

No production deployment or merge to main. Independent qualification branch retained for provenance. See PR #74.
