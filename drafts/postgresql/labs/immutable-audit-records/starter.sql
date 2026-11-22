CREATE TEMP TABLE lesson_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 actor_id integer,
 action text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now()
);
