CREATE TEMP TABLE lesson_accounts (
 id bigint GENERATED ALWAYS AS IDENTITY,
 tenant_id text NOT NULL,
 email text NOT NULL UNIQUE
);
