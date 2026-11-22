DO $check$ BEGIN
 IF (SELECT max_connections FROM lesson_limits)<>current_setting('max_connections')::integer OR (SELECT reserved_connections FROM lesson_limits)<>current_setting('superuser_reserved_connections')::integer THEN RAISE EXCEPTION '12.04.06 connection settings were fabricated'; END IF;
END $check$;
