CREATE POLICY lab_private_objects_owner_read ON storage.objects
 FOR SELECT TO authenticated
 USING (
   bucket_id = 'academy_private_docs'
   AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
 );
