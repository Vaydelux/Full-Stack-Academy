-- Exposed public table with no RLS protection.
CREATE TABLE public.academy_project_notes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 body text NOT NULL
);
GRANT SELECT ON public.academy_project_notes TO authenticated;
