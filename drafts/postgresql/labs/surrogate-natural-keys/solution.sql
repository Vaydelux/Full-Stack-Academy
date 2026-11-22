CREATE TEMP TABLE lesson_accounts (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 email text NOT NULL,
 UNIQUE (tenant_id, email)
);
