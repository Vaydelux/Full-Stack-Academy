DO $check$ BEGIN
 IF (SELECT database_name FROM lesson_environment)<>current_database() OR (SELECT connected_role FROM lesson_environment)<>current_user THEN RAISE EXCEPTION '12.05.04 database identity was hardcoded or wrong'; END IF;
END $check$;
