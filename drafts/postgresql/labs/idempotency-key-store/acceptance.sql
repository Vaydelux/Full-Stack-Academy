DO $check$ BEGIN
 IF (SELECT result_id FROM training_requests WHERE tenant_id='alpha' AND request_key='charge-1')<>100 OR (SELECT count(*) FROM training_requests WHERE request_key='charge-1')<>1 THEN RAISE EXCEPTION '12.03.05 idempotency result was overwritten'; END IF;
END $check$;
