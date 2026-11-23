\set ON_ERROR_STOP on
BEGIN;
SET LOCAL ROLE :"runtime_role";
SELECT json_build_object(
 'role',current_user,
 'canEditMemberships',has_table_privilege(current_user,format('%I.memberships', :'schema'),'UPDATE'),
 'canEditUsers',has_table_privilege(current_user,format('%I.users', :'schema'),'UPDATE'),
 'canCreateObjects',has_schema_privilege(current_user, :'schema','CREATE'),
 'canReadDocuments',has_table_privilege(current_user,format('%I.documents', :'schema'),'SELECT'),
 'canUpdateDocuments',has_column_privilege(current_user,format('%I.documents', :'schema'),'title','UPDATE')
)::text;
COMMIT;
