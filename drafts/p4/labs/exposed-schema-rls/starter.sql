CREATE TABLE public.lesson_notes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 owner_id uuid NOT NULL,
 body text NOT NULL
);
GRANT SELECT ON public.lesson_notes TO authenticated;
