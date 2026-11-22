SELECT count(*) AS recovered_rows,
       md5(string_agg(id::text || ':' || state, '|' ORDER BY id)) AS recovered_checksum
FROM ops_tasks;
