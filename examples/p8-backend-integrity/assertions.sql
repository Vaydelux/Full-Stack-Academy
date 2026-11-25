\set ON_ERROR_STOP on
BEGIN;
INSERT INTO accounts(id,balance) VALUES (1,100),(2,20);
DO $$
BEGIN
 IF NOT transfer('00000000-0000-0000-0000-000000000001',1,2,30) THEN RAISE EXCEPTION 'first transfer not applied'; END IF;
 IF transfer('00000000-0000-0000-0000-000000000001',1,2,30) THEN RAISE EXCEPTION 'duplicate applied'; END IF;
 BEGIN
  PERFORM transfer('00000000-0000-0000-0000-000000000001',1,2,31);
  RAISE EXCEPTION 'changed payload accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  PERFORM transfer('00000000-0000-0000-0000-000000000002',1,2,999);
  RAISE EXCEPTION 'overdraft accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 IF (SELECT balance FROM accounts WHERE id=1)<>70 OR (SELECT balance FROM accounts WHERE id=2)<>50 THEN RAISE EXCEPTION 'wrong balances'; END IF;
 IF (SELECT sum(balance) FROM accounts)<>120 THEN RAISE EXCEPTION 'money conservation failed'; END IF;
 IF (SELECT count(*) FROM transfer_requests)<>1 THEN RAISE EXCEPTION 'failed request persisted'; END IF;
END $$;
ROLLBACK;
