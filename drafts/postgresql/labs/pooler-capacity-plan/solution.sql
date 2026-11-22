SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS reserved_connections,
       (SELECT count(*) FROM pg_stat_activity) AS observed_connections;
