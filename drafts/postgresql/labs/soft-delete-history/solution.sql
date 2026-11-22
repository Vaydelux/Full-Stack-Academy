CREATE TEMP TABLE lesson_labels (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 label text NOT NULL,
 deleted_at timestamptz
);
CREATE UNIQUE INDEX lesson_active_labels_unique
 ON lesson_labels (tenant_id, lower(label)) WHERE deleted_at IS NULL;
CREATE TEMP TABLE lesson_label_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 label_id integer NOT NULL REFERENCES lesson_labels(id),
 tenant_id text NOT NULL,
 action text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION pg_temp.record_label_archive() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
 IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
  INSERT INTO lesson_label_history(label_id,tenant_id,action)
  VALUES(NEW.id,NEW.tenant_id,'archived');
 END IF;
 RETURN NEW;
END $fn$;
CREATE TRIGGER label_archive_event
AFTER UPDATE OF deleted_at ON lesson_labels
FOR EACH ROW EXECUTE FUNCTION pg_temp.record_label_archive();
