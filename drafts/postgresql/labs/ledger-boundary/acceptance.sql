DO $check$ BEGIN
 IF (SELECT balance FROM training_wallets WHERE tenant_id='alpha' AND id='A')<>8 OR (SELECT balance FROM training_wallets WHERE tenant_id='alpha' AND id='B')<>4 OR (SELECT count(*) FROM training_events WHERE event_kind='transfer.completed' AND amount=2)<>1 THEN RAISE EXCEPTION '12.03.07 transfer and event are not one complete unit'; END IF;
END $check$;
