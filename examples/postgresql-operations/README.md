# 12.05 — Database Operations & Recovery

Eight manuscript lessons: **two SQL semantic contracts** (safe backfill/constraint and actual connection identity) and **six manual operational-review labs** (PITR, replicas, roles, poolers, restore drills and recovery capstone).

A SQL settings query does not establish disaster readiness. A valid backup must be restored into an isolated destination and its contents, privileges and elapsed recovery time verified independently. Real replica health needs a configured primary and replica; no source audit can stand in for this.

Do not issue `pg_restore --clean`, change PostgreSQL WAL settings or create roles in a production database for this course. Use a dedicated disposable local `academy_test` environment, separately approved operator procedures and the checklists under each lab's `acceptance.md`.

Source status: **draft-unverified**. No backup or recovery drill was run as part of the authoring milestone.
