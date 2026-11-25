# F8.6 specialized P7 runtime and F9 review preparation

Baseline 97e6ade1611b68890b03fe7e989f5135c384536b. No live lesson, registry, checkpoint, workflow or deployment changed. Published 338/889.

## Executable exercises
- 25.01: actual SQLite event ingestion, tenant-scoped event identity, conflicting payload rejection, restart persistence, indexed half-open time-window aggregation. No warehouse, dbt, concurrency benchmark or capacity claim.
- 25.02: authorized tenant filtering before cosine ranking of local bag-of-words term vectors. Exact source digest/character-span validation, fabricated/foreign/out-of-bounds citations rejected, empty result abstention. This is extractive retrieval, not learned embeddings, an LLM or semantic entailment evaluation. Treat text as data; never pass it to a tool executor. Trusted context and retrieved results must originate from the server, not a client.
- 25.03: bounded great-circle distance filtering with tenant isolation, invalid coordinate rejection and antimeridian/antipodal cases. No map UI, routing or PostGIS runtime.
- 25.04: actual generated canonical 16-bit PCM WAV file, strict header/payload/byte-rate consistency, duration/size budget and content hash. Not a general-purpose decoder, malware scanner, transcoder or RTC implementation.
- 26.03: SQLite retention plan and transactional logical deletion rechecking legal-hold and expiry after approval; non-admin and foreign-tenant isolation. Synthetic test data only; no legal or compliance claim, erasure from WAL/backups or real production deletion authorization. Admin context/approved IDs are trusted teaching inputs. Production needs independently authenticated approval, audit and retention governance.

## F9 review package preparation
On a complete checkout, run:
    npm run plan:late-phase -- --export-review 15.01
    npm run plan:late-phase -- --check-review-artifacts 15.01 PATH_TO_EXPORTED_DIRECTORY

The first command uses the existing canonical plan and current source fingerprints, exports one whole unpublished module to a fresh OS temporary directory, preserves original draft manuscripts, writes manifest.json and a blank evidence.json, and excludes the historical 15.02.04 publication. It refuses already/partially published modules or source drift. The manifest records shared source hashes but does not copy shared runtime files. Run commands in the complete checkout. The second command rederives the source-bound pack, checks the unchanged manuscript/manifest/README bytes, validates the existing evidence schema and hashes real sanitized artifact files (artifacts/source.log and artifacts/<lesson-id>.log). Files are bounded; no traversal or individual artifact symlink accepted. It verifies integrity, not who ran the tests or whether claims are truthful. Do not put secrets, PII, or fabricated results in review logs. No automatic approval or write into the live application.

This is a review export, not yet a live registry/MDX promotion projection. All 399 additional P5–P7 candidates are supported by the generic module exporter, but the complete checkout CLI has not been run in this environment. Publication must still follow P1, P2, P3, P4, P5, P6, P7 order.

## Verification and next step
Node24.11.1: six specialized tests and four isolated review-pack tests passed using real temporary files, SQLite, synthetic datasets and generated WAV bytes. Review artifact tests use a stub for structural validation; the CLI delegates to the existing validateEvidence implementation. Full checkout offline gate, root build, actual dependencies/external services, human accessibility and publication are unexecuted. Next implement live publication projections for the earliest remaining modules (P1/P2 already have guarded commands), qualify them on a complete local workstation, then progressively promote with authentic reviewer evidence. Do not add new curriculum topics.
