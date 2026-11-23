-- LOCAL SUPABASE STACK ONLY; this source is not automatically applied.
-- A reviewer must install fixture via an isolated test migration, not a live project.
CREATE TABLE public.academy_lab_tasks(
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 owner_id uuid NOT NULL,
 title text NOT NULL
);
CREATE TABLE public.academy_lab_memberships(
 tenant_id text NOT NULL,
 user_id uuid NOT NULL,
 role text NOT NULL CHECK (role IN ('reader','editor')),
 PRIMARY KEY (tenant_id,user_id)
);
ALTER TABLE public.academy_lab_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_lab_memberships ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies here: lesson solutions must define them.
-- Use test-only auth accounts and explicitly scoped Grants after policies.
