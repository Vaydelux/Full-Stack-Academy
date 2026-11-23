\set ON_ERROR_STOP on
BEGIN;
SET LOCAL p5.actor TO :'actor';
\if :{?P5_READ}
SELECT COALESCE((SELECT json_build_object('id',d.id,'title',d.title)::text FROM :"schema".documents d WHERE d.id=:'doc_id'), 'null');
\endif
\if :{?P5_UPDATE}
WITH changed AS (UPDATE :"schema".documents SET title=:'title' WHERE id=:'doc_id' RETURNING id,title)
SELECT COALESCE((SELECT row_to_json(changed)::text FROM changed),'null');
\endif
\if :{?P5_DELETE}
WITH deleted AS (DELETE FROM :"schema".documents WHERE id=:'doc_id' RETURNING id)
SELECT COALESCE((SELECT row_to_json(deleted)::text FROM deleted),'null');
\endif
\if :{?P5_UPLOAD}
SELECT COALESCE((SELECT json_build_object('tenantId',d.tenant_id,'documentId',d.id)::text FROM :"schema".documents d
 WHERE d.id=:'doc_id' AND NOT d.locked AND NOT d.deleted AND EXISTS (SELECT 1 FROM :"schema".memberships m JOIN :"schema".users u ON u.id=m.user_id
 WHERE m.user_id=:'actor' AND m.tenant_id=d.tenant_id AND m.active AND u.active AND m.role IN ('owner','editor'))), 'null');
\endif
COMMIT;
