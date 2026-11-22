SELECT count(*) AS records_before,
       md5(string_agg(id::text || ':' || state, '|' ORDER BY id)) AS before_checksum
FROM ops_tasks;
