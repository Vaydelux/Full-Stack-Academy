# Graduation capstone: Multi-tenant project workspace

This is an instructor specification, not a finished SaaS or a published capstone. Build one coherent application through the five canonical Track 27 phases. Use the existing Academy Next/React, NestJS and PostgreSQL/Prisma/Supabase curriculum as the baseline; alternate technology choices require an ADR with equivalent evidence. Keep all initial execution local and synthetic. Do not enable cloud deployment, billing, or production credentials as a prerequisite.

## Scope and architecture
Actors: anonymous visitor, authenticated member, tenant administrator, system worker. Core journeys: discover the public site, sign in, create and list tenant-scoped tasks, attach quarantined files, deliver notifications, search, receive updates, and review scoped audit history. Non-goals for initial release: production SSO, payments, native applications, distributed microservices and paid AI services.

A public web surface and authenticated workspace invoke a typed API. Domain modules own tasks, members, attachments, notifications and audit. PostgreSQL holds authoritative records and durable event intent; Redis is a replaceable cache/queue dependency, never the authority for membership. Use explicit server-validated session identity and tenant membership. All worker effects have bounded retry, idempotency and recovery. Deployment topology is a local private stack; the public edge alone receives ingress if a later release is authorized.

## Canonical phase deliverables and acceptance

| Module | Deliverables | Blocking negative evidence |
|---|---|---|
| 27.01 Web | Scope, ADR, route map, component examples, public SEO, workspace and accessibility report | Private route indexing, keyboard trap, inaccessible form, unauthorized workspace |
| 27.02 API & Data | OpenAPI/Zod contracts, Nest domain modules, migration/rollback rehearsal, scoped repositories, validated tokens, actual integration tests | Foreign tenant access, decoded-only JWT, incompatible migration, private fields |
| 27.03 Features | Paginated CRUD, quarantine/upload, durable notifications, Redis invalidation, reconnect, search, audit | Stale or foreign data, duplicate delivery, unsafe upload, missing audit |
| 27.04 Production | Reproducible local stack, immutable build evidence, rollback drill, observability, security, load and restore reports | Unverified backup, stale test commit, unavailable dependency scan, failed functional smoke |
| 27.05 Defense | Security review, fault drill, ADR defense, reproducible docs, scenario cost forecast, honest portfolio case study, upgrade plan | Missing negative case, fabricated metrics, unresolved recovery or unsupported claim |

## Evidence contract
For every acceptance target record the exact candidate Git SHA, tool/runtime version, synthetic fixture, command or manual protocol, expected outcome, observed outcome, pass/fail/not-run, timestamp and reviewer. Store output outside the tracked checkout or redact it before committing. Never include credentials, personal records, real tenant data, unredacted request bodies or secrets. A failed test has reproduction and owner; a blocked test has the prerequisite needed to unblock. A green synthetic model is supporting evidence only.

## Graduation review
The reviewer checks five dimensions: demonstrated functionality and negative tests; architecture decisions and tradeoffs; resilience and verified recovery; defensible cost and capacity assumptions; reproducible documentation and accessible user flows. Each dimension is reviewed or pending; no averaging away blocking failures. The learner demonstrates the actual local app, discusses one failure and recovery, and provides an exact-commit evidence index. Manual screen-reader, keyboard, zoom and relevant device checks remain required. A portfolio case study must clearly distinguish local verification from hosted deployment. Only independent reviewed evidence can approve graduation.
