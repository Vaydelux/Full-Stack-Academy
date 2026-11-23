-- Stage 1: compatible expansion (on a disposable database).
ALTER TABLE training_tasks ADD COLUMN priority integer;
-- Stage 2: verified idempotent backfill.
UPDATE training_tasks SET priority = 1 WHERE priority IS NULL;
-- Stage 3: enforce only after old writers are upgraded.
ALTER TABLE training_tasks ALTER COLUMN priority SET NOT NULL;
