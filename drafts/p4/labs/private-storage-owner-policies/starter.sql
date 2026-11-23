CREATE POLICY lab_private_objects_read ON storage.objects
 FOR SELECT TO authenticated
 USING (bucket_id = 'academy_private_docs');
