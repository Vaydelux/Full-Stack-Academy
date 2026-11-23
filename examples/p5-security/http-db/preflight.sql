\set ON_ERROR_STOP on
SELECT json_build_object('database',current_database(),'super',rolsuper,'bypass',rolbypassrls)::text
FROM pg_roles WHERE rolname=current_user;
