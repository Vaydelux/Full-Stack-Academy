# P3 independent runtime qualification

Prepared after the combined P1/P2 candidate. The formal publication count remains 338. This gate is independent of lesson publication order: it runs 24 SQL red/green pairs in 12.01–12.03, eight independent transaction exercises in 12.03, eight runtime artifacts in 12.04 and five in 12.05. The latter include six semantic checks across the two modules, four measured performance cases and three logical restore checks. Existing validators enforce exact source, commit and acceptance bindings.

Run on Linux with Docker, Node 24.9+, registry access and PostgreSQL 17 client binaries (psql, pg_dump, pg_restore):

```bash
bash scripts/qualify-p3-isolated.sh
```

Four fresh dedicated databases and three restricted login roles are created inside a disposable PostgreSQL 17 container. The container is removed on normal or caught-error exit. Review packs are generated outside the checkout and retained for inspection; the printed directory paths locate their evidence. No source projection is applied. The restore exercise is logical schema restore only; PITR, replication, role/ACL restoration, pooler behavior and other operator obligations remain manual. No human review, browser qualification or publication is implied.

The launcher and coordinator are a prepared candidate, not proof of execution. Do not advance the existing PR branch while its pending combined rehearsal could be displaced by another queued run. After P2 finishes, reconcile the branch, adopt this candidate, execute the P3 gate and address observed failures. Full 426-lesson rehearsal still requires a safe mixed-evidence projection design.
