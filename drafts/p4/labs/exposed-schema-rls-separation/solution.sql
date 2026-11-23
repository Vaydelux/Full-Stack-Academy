CREATE TABLE public.academy_project_notes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 tenant_id text NOT NULL,
 owner_id uuid NOT NULL,
 body text NOT NULL
);
ALTER TABLE public.academy_project_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_own ON public.academy_project_notes
 FOR SELECT TO authenticated
 USING (owner_id = (SELECT auth.uid()));
GRANT SELECT ON public.academy_project_notes TO authenticated;
