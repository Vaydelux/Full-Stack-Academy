# P3 chained source rehearsal checkpoint

The P2 review coordinator now additionally computes the five P3 projections in memory, after successful 386-lesson offline and Chromium gates. It preserves the actual 386-lesson fixture on disk. The first three SQL projections target 410; the last two explicitly non-applicable overlays target 426. All five are source-only, 283 unique projected files, 10 blocked manual wrappers; nothing is copied into the checkout. Existing source binding and overlay guards are reused.

Fixed the published SQL lab dispatcher to allow 12.03 and use a 150-second outer process timeout for its 120-second concurrency test. The 12.04/12.05 review-only wrappers remain excluded.

Run targeted unit tests with `node --test tests/p3-source-rehearsal.test.mjs`. Full 410 live projection and 426 mixed-evidence apply are NOT implemented, and actual runtime evidence and named operator review are still needed. The independent P3 runtime candidate remains separate from the active P2 branch until the queued qualification is complete.
