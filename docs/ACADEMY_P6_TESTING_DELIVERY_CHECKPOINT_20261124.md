# P6 Testing and Delivery — Tracks 19 and 20

**2026-11-24 | Source-only authoring and isolated Node22 qualification | No publication or deployment**

## Implementation

64 canonical source-only MDX manuscripts with `status: "draft-unverified"` and `readyToPublish: false`, eight lessons per module:
- 19.01 Testing Pyramid; 19.02 Frontend Testing; 19.03 Backend & Database Tests; 19.04 Performance & Reliability Tests.
- 20.01 Docker Fundamentals; 20.02 Continuous Integration; 20.03 Continuous Delivery; 20.04 Infrastructure Operations.

Each topic has a distinct scenario and explicit practice/positive/negative acceptance, a linked technical reference (not independently link-checked), a model command and untested-runtime disclosure. The eight models exercise stock invariants, async request fencing, tenant/owner DTO isolation, sample-based p95 and error thresholds, declared container policies, exact-commit job completeness, release hold/promote/rollback decisions and private topology checks. They are not substitutes for real tool installation and external acceptance.

The common staged inventory reader replaces two inconsistent hardcoded folder lists, detects duplicate IDs, missing manuscript pairs and invalid frontmatter, and is used by both curriculum-readiness and publication-phase reporting. The tree audit of the preceding main showed **272 historical draft manuscript files, with 15.02.04 also in the published inventory**. The corrected counts are:
| Category | Before | After |
|---|---:|---:|
| Canonical | 889 | 889 |
| Published unique IDs | 338 | 338 |
| Historical manuscript files | 272 | 336 |
| Staged unpublished unique IDs | 271 | 335 |
| Not authored | 280 | 216 |

P6 source manuscripts cover 64 of 144 topics; remaining P6 scope is 80 topics in Tracks 21–23. Publication status is not changed by this milestone.

## Executed evidence

Local Node 22.16.0 isolated tests passed **63/63**, including 41 model tests, 11 staged-inventory tests with temporary directories, and 11 manuscript-auditor mutation tests with synthetic canonical fixtures. No full local checkout or actual external runtime used.

Exact source/test Git blob IDs:
- `examples/p6-quality/labs.mjs`: `63159c01eabf93833e00fd79d37d5691119cc865`
- `examples/p6-quality/labs.test.mjs`: `e068ff0998cfcb8ecd9b22d08f8c54a94506bd78`
- `scripts/staged-inventory.mjs`: `24ce92cdba3651bbf9f4882d9a9206633af42e45`
- `tests/staged-inventory.test.mjs`: `b90d8dcfe4a4b63cf2700ffb48c530a699a99e54`
- `examples/p6-quality/verify-track.mjs`: `e398f43f829669ceb556952c4492969afab53e7d`
- `examples/p6-quality/verify-track.test.mjs`: `2f7ec388b1b2202c597a448c2be11f091d058d34`

The GitHub tree has 64 expected new manuscript paths. The full-checkout audit is wired into the release gate and must still be executed in the complete runtime environment. No independent installed DOM/Vitest/Testing Library/MSW/Playwright, NestJS/PostgreSQL, k6, Docker/Compose, hosted CI, VPS, Caddy, certificate/DNS or OpenTofu/Terraform acceptance was run. No actual performance or production SLO is claimed.

## Commands

```bash
npm run test:p6-quality-source
npm run test:curriculum-readiness
npm run test:publication-phases
npm run qualify:academy:local -- --plan-p1
```

The full offline Node24 gate now includes the P6 source step, in addition to the previous 20 P5 test groups.

## Continuation

1. Complete 21.01–21.03 observability/SRE (24 topics), 22.01–22.03 performance (24), 23.01–23.04 architecture/DDD (32).
2. Build real red/green runtime fixtures, including browser interaction, local database and containers; retain actual evidence. Never substitute source model tests for real integration.
3. Use the independent P1 qualification profile; genuine NestJS package-lock remains required for the wider profile.
4. Full Node24 Next build, browser and human accessibility checks, and module-specific publication review remain blocking. No registry, workflow or Vercel configuration changed.
