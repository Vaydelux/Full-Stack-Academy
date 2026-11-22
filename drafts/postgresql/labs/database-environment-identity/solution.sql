CREATE TEMP VIEW lesson_environment AS SELECT current_database()::text AS database_name,current_user::text AS connected_role;
