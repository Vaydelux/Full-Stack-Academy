-- Disposable teaching database only.
CREATE TABLE accounts (
 id bigint PRIMARY KEY,
 balance bigint NOT NULL CHECK (balance >= 0),
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0)
);
CREATE TABLE transfer_requests (
 request_id uuid PRIMARY KEY,
 source_id bigint NOT NULL REFERENCES accounts(id),
 target_id bigint NOT NULL REFERENCES accounts(id),
 amount bigint NOT NULL CHECK (amount > 0),
 CHECK (source_id <> target_id)
);
CREATE FUNCTION transfer(p_request uuid,p_source bigint,p_target bigint,p_amount bigint)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE prior transfer_requests%ROWTYPE;
BEGIN
 IF p_request IS NULL OR p_source IS NULL OR p_target IS NULL OR p_amount IS NULL OR p_amount <= 0 OR p_source = p_target THEN
  RAISE EXCEPTION 'invalid transfer' USING ERRCODE='22023';
 END IF;
 -- Lock both rows in stable order before inserting foreign-key references.
 PERFORM id FROM accounts WHERE id IN (p_source,p_target) ORDER BY id FOR UPDATE;
 IF (SELECT count(*) FROM accounts WHERE id IN (p_source,p_target)) <> 2 THEN
  RAISE EXCEPTION 'unknown account' USING ERRCODE='22023';
 END IF;
 INSERT INTO transfer_requests VALUES(p_request,p_source,p_target,p_amount)
 ON CONFLICT (request_id) DO NOTHING;
 IF NOT FOUND THEN
  SELECT * INTO STRICT prior FROM transfer_requests WHERE request_id=p_request;
  IF (prior.source_id,prior.target_id,prior.amount) IS DISTINCT FROM (p_source,p_target,p_amount) THEN
   RAISE EXCEPTION 'request key reused with different payload' USING ERRCODE='22023';
  END IF;
  RETURN false;
 END IF;
 UPDATE accounts SET balance=balance-p_amount,revision=revision+1 WHERE id=p_source AND balance>=p_amount;
 IF NOT FOUND THEN RAISE EXCEPTION 'insufficient balance' USING ERRCODE='23514'; END IF;
 UPDATE accounts SET balance=balance+p_amount,revision=revision+1 WHERE id=p_target;
 RETURN true;
END $$;
