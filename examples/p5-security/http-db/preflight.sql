\set ON_ERROR_STOP on
-- Inspect the actual connected server and role, not only the URL provided by a caller.
SELECT json_build_object(
 'database',current_database(),
 'serverVersion',current_setting('server_version_num')::integer,
 'rowSecurity',current_setting('row_security'),
 'super',rolsuper,
 'bypass',rolbypassrls
)::text
FROM pg_roles WHERE rolname=current_user;
