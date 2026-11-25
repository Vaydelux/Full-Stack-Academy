# F7 — late-phase qualification preparation

Baseline: 677edb8bdedd55cfcc6add9e46f2b338d10bc24b. Canonical scope frozen at 889 topics; published count remains 338. No new live MDX, dependency, workflow or deployment changes.

## Delivered

- Complete recursive Git tree (not truncated): 400 canonical P5–P7 manuscript paths verified present and bound to their Git blobs, including historical interactive lesson 15.02.04. 399 additional candidates, 50 modules. 110 actual shared example/specification files recorded in data/late-phase-source-baseline.json. This is historical source inventory, not an execution receipt.
- data/late-phase-runtime-gates.json defines two concrete external-runtime evidence obligations for each of 50 modules. These are requirements, not implementations of external services or proof of test success.
- The read-only planner builds current module fingerprints from manuscripts, shared example/specification source, source command and required runtime gates. It checks exact module/topic coverage, frontmatter and publication flags, guided sections, historical overlap and atomic publication. It uses the live MDX/interactive inventory rather than counting staged drafts as published.
- Per-module blank evidence template requires actual positive, negative, runtime and accessibility observations for each candidate. The identity module has seven new candidates, not eight. Validation rejects stale source, incomplete, duplicate or falsely approved evidence; it checks structure only, not artifact contents or authenticity.
- Reproduced two real staged-inventory failures with the original source: valid legacy security publication:false was rejected, and contradictory readyToPublish flags were accepted. The replacement allows only one false flag, with the older spelling limited to security drafts.
- Integrated test:late-phase into the mandatory local offline matrix. No automatic publication.

## Actual verification

Node 24.11.1 isolated helper tests: 11/11, plus 3/3 filesystem inventory regression tests after repair (2 failing before repair). The tested four source/test blobs were checked against candidate Git objects. The full repository source plan, production build, external runtime checks, browser and human review have not executed here; npm/GitHub DNS remains unavailable in the local shell. The baseline is not a signed qualification receipt. No claims of service, device or regulatory certification.

## Commands on an approved clean checkout

- npm run test:late-phase
- npm run plan:late-phase -- --module 15.01
- npm run --silent plan:late-phase -- --template 15.01 (redirect to a review file outside the repository if desired)
- npm run plan:late-phase -- --check-evidence 15.01 /path/to/actual-review.json

Use only synthetic data and authorized disposable services. Run the listed source command, then actual module-specific runtime checks and independent human review. Preserve real receipts and artifact hashes; verify the contents independently before any approval. A passing structural check is explicitly not permission to publish.

## Remaining critical path

P1 RHF/Query then P2 NestJS remain first. P3/P4 and P5–P7 plans are source qualification infrastructure; they do not replace missing executable lesson-specific publication projections, lab wrappers, runtime adapters and guarded promotion. Next implement those for P3/P4 before building all late-phase promotion machinery. Avoid repeating source-only planning without advancing actual executable qualification. The phase targets remain 354, 386, 426, 490, 609, 753, 889. No production deploy while release gates remain incomplete.
