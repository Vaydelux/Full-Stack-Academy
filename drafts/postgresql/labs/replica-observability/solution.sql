SELECT pg_is_in_recovery() AS is_replica;
SELECT application_name,state,sync_state,write_lag,flush_lag,replay_lag FROM pg_stat_replication;
SELECT status,received_lsn,latest_end_lsn FROM pg_stat_wal_receiver;
