SELECT rolname,rolsuper,rolcreatedb,rolcreaterole,rolcanlogin
FROM pg_roles WHERE rolname=current_user;
