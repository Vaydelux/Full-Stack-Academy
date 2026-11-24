# P6 Quality and Delivery teaching laboratory

Tracks 19–20, eight canonical modules and 64 unpublished source manuscripts under `drafts/p6-quality/lessons/`.

Run `node --test examples/p6-quality/labs.test.mjs` for 41 dependency-free behavior cases; `node --test examples/p6-quality/verify-track.test.mjs` for 11 source-auditor fixture regressions. On a full checkout, `npm run test:p6-quality-source` additionally checks the actual catalog, 64 manuscript files, specifications and publication inventory.

| Module | Model |
|---|---|
| 19.01 Testing Pyramid | reserve — positive/negative boundaries and finite stock conservation |
| 19.02 Frontend Testing | latestRequest — loading/error/success and stale-response denial |
| 19.03 Backend & Database Tests | scopedRead — synthetic actor/owner denial and minimal DTO |
| 19.04 Performance & Reliability Tests | latencyReport — nearest-rank p95, error budget, invalid samples |
| 20.01 Docker Fundamentals | containerPolicy — declared digest, UID, privileges, filesystem and socket |
| 20.02 Continuous Integration | matrixGate — expected distinct jobs and exact commit |
| 20.03 Continuous Delivery | releaseDecision — approval, compatibility, health and smoke decisions |
| 20.04 Infrastructure Operations | topologyPolicy — explicit public edge, secret and backup policy |

These deliberately small examples are **teaching models**, not validators for arbitrary Dockerfiles, real authorization servers, real traffic or deployable infrastructure. An invented digest is not proof of provenance; boolean evidence is not verification; synthetic RLS checks do not execute SQL. Use the topic-specific external acceptance exercises before any publication.

Every manuscript specifies an independent scenario, concept, guided task, positive and negative acceptance, reference, and qualification boundary. Real tools must be run only against explicitly authorized disposable environments. No Actions or Vercel changes are required.

See `docs/ACADEMY_P6_TESTING_DELIVERY_CHECKPOINT_20261124.md`.
