SELECT name,setting,unit,source FROM pg_settings
WHERE name IN ('archive_mode','archive_command','wal_level','max_wal_senders') ORDER BY name;
