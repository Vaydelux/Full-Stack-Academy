DO $check$ BEGIN
 IF (SELECT balance FROM training_wallets WHERE tenant_id='alpha' AND id='A')<>9 OR (SELECT version FROM training_wallets WHERE tenant_id='alpha' AND id='A')<>2 THEN RAISE EXCEPTION '12.03.04 stale optimistic write was not rejected'; END IF;
END $check$;
