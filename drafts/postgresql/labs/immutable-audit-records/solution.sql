CREATE TEMP TABLE lesson_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 actor_id integer NOT NULL,
 action text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION pg_temp.prevent_audit_mutation() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
 RAISE EXCEPTION 'audit events are immutable';
END $fn$;
CREATE TRIGGER prevent_audit_change
BEFORE UPDATE OR DELETE ON lesson_audit
FOR EACH ROW EXECUTE FUNCTION pg_temp.prevent_audit_mutation();
