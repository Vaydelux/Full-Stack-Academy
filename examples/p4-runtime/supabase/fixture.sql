-- Apply manually ONLY to a fresh local Supabase stack after creating synthetic users.
-- This is not a deployment migration. Stop on errors; do not use a production SQL editor.
BEGIN;
CREATE TABLE public.academy_runtime_documents (
 id uuid PRIMARY KEY,
 owner_id uuid NOT NULL REFERENCES auth.users(id),
 title text NOT NULL CHECK(length(trim(title))>0)
);
ALTER TABLE public.academy_runtime_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_runtime_documents FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.academy_runtime_documents FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_runtime_documents TO authenticated;
CREATE POLICY academy_runtime_read ON public.academy_runtime_documents FOR SELECT TO authenticated USING ((SELECT auth.uid())=owner_id);
CREATE POLICY academy_runtime_insert ON public.academy_runtime_documents FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid())=owner_id);
CREATE POLICY academy_runtime_update ON public.academy_runtime_documents FOR UPDATE TO authenticated USING ((SELECT auth.uid())=owner_id) WITH CHECK ((SELECT auth.uid())=owner_id);
CREATE POLICY academy_runtime_delete ON public.academy_runtime_documents FOR DELETE TO authenticated USING ((SELECT auth.uid())=owner_id);
INSERT INTO storage.buckets(id,name,public) VALUES ('academy-runtime-private','academy-runtime-private',false);
CREATE POLICY academy_runtime_storage_insert ON storage.objects FOR INSERT TO authenticated
 WITH CHECK (bucket_id='academy-runtime-private' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
CREATE POLICY academy_runtime_storage_read ON storage.objects FOR SELECT TO authenticated
 USING (bucket_id='academy-runtime-private' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
CREATE POLICY academy_runtime_storage_delete ON storage.objects FOR DELETE TO authenticated
 USING (bucket_id='academy-runtime-private' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
COMMIT;
