CREATE TEMP VIEW lesson_limits AS
SELECT current_setting('max_connections')::integer AS max_connections,
       current_setting('superuser_reserved_connections')::integer AS reserved_connections;
