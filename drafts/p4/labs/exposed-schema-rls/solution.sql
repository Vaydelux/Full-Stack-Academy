CREATE TABLE public.lesson_notes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 owner_id uuid NOT NULL,
 body text NOT NULL
);
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_owner_read ON public.lesson_notes
 FOR SELECT TO authenticated
 USING (owner_id = (SELECT auth.uid()));
GRANT SELECT ON public.lesson_notes TO authenticated;
