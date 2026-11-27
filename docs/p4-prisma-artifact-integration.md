# P4 verified Prisma lock artifact integration

Run 45999662389 completed successfully on exact parent d6afc2c. Artifact 15197098466 contains the real 124-package lock and its validation receipt. SHA-256 of the archive: be91023acc95adddd555a57879019455f3ed952d0fe67e95facfeb4508d223d5. Lock SHA-256: 248b45136534894415fb501fcc0d9c2bcfb216ce48ccb26f6ec13e746835d0ee.

The new workflow downloads this specific artifact, validates exact source/receipt/lock bindings, and splits two jobs. A restricted contents-write job creates a detached Git commit containing only the lockfile; it never runs dependency code, updates refs, merges or deploys. A read-only runtime job runs npm ci with lifecycle scripts, a high-severity npm audit gate, and the existing Prisma validation, client generation, migration history, catalog and CRUD exercises on a disposable loopback PostgreSQL 17 instance. The runtime does not imply lesson-level qualification or human approval.

Seven local positive/negative artifact validation cases passed using the actual downloaded bytes and Node 22. The complete hosted runtime and detached commit creation are not executed yet. The original P2 and P3 queue must be protected before adopting this candidate. Verify the detached commit parent and exact single-file diff before any ref update. Artifact expiry is 2026-12-04 UTC; do not silently regenerate or substitute its bytes.
