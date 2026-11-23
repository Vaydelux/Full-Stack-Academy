# P5 Security Foundations — unpublished authoring batch

Eight original, **source-authored only** lesson manuscripts for canonical module **15.01**, matching `data/curriculum.json` IDs 15.01.01–15.01.08. These are not learner-facing published articles, and are not currently wired to the production reader. The security examples are deliberately conceptual; no runtime security tests or peer reviews have been run.

## Module sequence

- 15.01.01 — Threat modeling STRIDE
- 15.01.02 — Authentication vs authorization
- 15.01.03 — OWASP ASVS control mapping
- 15.01.04 — Trust boundaries and assets
- 15.01.05 — Secure defaults
- 15.01.06 — Secrets management
- 15.01.07 — Data classification
- 15.01.08 — Lab threat model

## Acceptance before publication

1. Compare IDs and titles with the canonical curriculum, check links and the MDX authoring specification.
2. Convert the most important failure cases to runnable starter/solution exercises using a dedicated, isolated workspace API fixture.
3. Prove two-user and cross-tenant denial against real server/data boundaries; test revocation, unauthorized object access and redaction.
4. Review the exact ASVS version/level and control mapping; do not claim certification or compliance from self-assessment alone.
5. Run the Node 24 release suite, Next build, responsive/browser tests and named human accessibility evaluation.
6. Follow P1→P2→P3→P4→P5 sequential publication policy; leave the live registry unchanged until gates pass.

**Publication accounting after this batch:** 338 published, 160 source-authored drafts, 391 unauthored, 889 canonical topics. This count treats these eight new manuscripts as source-authored, not qualified.
