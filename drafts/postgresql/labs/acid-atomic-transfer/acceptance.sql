DO $check$ BEGIN
 IF (SELECT balance FROM training_wallets WHERE tenant_id='alpha' AND id='A')<>6 OR (SELECT balance FROM training_wallets WHERE tenant_id='alpha' AND id='B')<>6 OR (SELECT sum(balance) FROM training_wallets WHERE tenant_id='alpha')<>12 THEN RAISE EXCEPTION '12.03.01 transfer invariant violated'; END IF;
END $check$;
