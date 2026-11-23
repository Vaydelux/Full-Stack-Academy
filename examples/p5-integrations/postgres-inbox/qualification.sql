-- P5 PostgreSQL inbox SQL contract qualification.
-- This is rollback-only; NEVER run against a production database.
\set ON_ERROR_STOP on
BEGIN;
DO $$ BEGIN
 IF current_setting('server_version_num')::integer < 170000 THEN
  RAISE EXCEPTION 'PostgreSQL 17+ required';
 END IF;
 IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname=current_user AND (rolsuper OR rolbypassrls)) THEN
  RAISE EXCEPTION 'Privileged role refused';
 END IF;
END $$;
\ir schema.sql

-- 01: table has FORCE ROW LEVEL SECURITY enabled.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='p5_inbox_lab' AND c.relname='deliveries'
    AND c.relrowsecurity AND c.relforcerowsecurity) THEN
  RAISE EXCEPTION '01: missing FORCE RLS'; END IF;
END $$;

-- Seed two tenants under trusted session-transaction claims.
SELECT set_config('p5.tenant_id','north',true);
INSERT INTO p5_inbox_lab.deliveries
 (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
 VALUES
 ('north','sender','n1',repeat('a',64),'\x0102'::bytea,decode(repeat('aa',12),'hex'),decode(repeat('bb',16),'hex')),
 ('north','sender','n2',repeat('b',64),'\x0304'::bytea,decode(repeat('cc',12),'hex'),decode(repeat('dd',16),'hex'));
SELECT set_config('p5.tenant_id','south',true);
INSERT INTO p5_inbox_lab.deliveries
 (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
 VALUES('south','sender','s1',repeat('c',64),'\x0506'::bytea,decode(repeat('ee',12),'hex'),decode(repeat('ff',16),'hex'));

-- 02: tenant scope isolates every selectable row.
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_inbox_lab.deliveries)<>1 THEN
  RAISE EXCEPTION '02: south tenant leaked north'; END IF;
END $$;

-- 03: empty tenant claim closes all visibility.
SELECT set_config('p5.tenant_id','',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM p5_inbox_lab.deliveries) THEN
  RAISE EXCEPTION '03: empty tenant leaked'; END IF;
END $$;

-- 04: role must not have BYPASSRLS or superuser.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname=current_user AND (rolsuper OR rolbypassrls)) THEN
  RAISE EXCEPTION '04: runtime role bypasses RLS'; END IF;
END $$;

-- 05: no tenant context cannot insert under RLS.
DO $$ BEGIN
 BEGIN
  INSERT INTO p5_inbox_lab.deliveries
   (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
   VALUES('north','sender','attack',repeat('a',64),'\x01'::bytea,decode(repeat('aa',12),'hex'),decode(repeat('bb',16),'hex'));
  RAISE EXCEPTION '05: insert unexpectedly accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;

-- 06: opposite-tenant insert denied under another tenant's claim.
SELECT set_config('p5.tenant_id','north',true);
DO $$ BEGIN
 BEGIN
  INSERT INTO p5_inbox_lab.deliveries
   (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
   VALUES('south','sender','attack',repeat('a',64),'\x01'::bytea,decode(repeat('aa',12),'hex'),decode(repeat('bb',16),'hex'));
  RAISE EXCEPTION '06: cross tenant insert accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;

-- 07: inbox composite identity makes same-event redeliveries idempotent.
INSERT INTO p5_inbox_lab.deliveries
 (tenant_id,provider,event_id,payload_digest,encrypted_body,iv,auth_tag)
 VALUES('north','sender','n1',repeat('a',64),'\x01'::bytea,decode(repeat('aa',12),'hex'),decode(repeat('bb',16),'hex'))
 ON CONFLICT (tenant_id,provider,event_id) DO NOTHING;
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_inbox_lab.deliveries WHERE provider='sender' AND event_id='n1')<>1 THEN
  RAISE EXCEPTION '07: duplicate inserted'; END IF;
END $$;

-- 08: valid single-row claim atomically moves pending -> processing with lease fence.
UPDATE p5_inbox_lab.deliveries
 SET state='processing',attempts=attempts+1,lease_token='11111111-1111-4111-8111-111111111111'::uuid,
  lease_expires_at=clock_timestamp()+interval '30 seconds'
 WHERE tenant_id='north' AND provider='sender' AND event_id='n1';
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_inbox_lab.deliveries
  WHERE event_id='n1' AND state='processing' AND attempts=1 AND lease_token IS NOT NULL)<>1 THEN
  RAISE EXCEPTION '08: claim not recorded'; END IF;
END $$;

-- 09: wrong worker lease token cannot settle.
DO $$ DECLARE n integer;BEGIN
 UPDATE p5_inbox_lab.deliveries SET state='processed',lease_token=NULL,lease_expires_at=NULL
 WHERE event_id='n1' AND tenant_id='north' AND state='processing'
  AND lease_token='22222222-2222-4222-8222-222222222222'::uuid
 RETURNING 1 INTO n;
 IF n IS NOT NULL THEN RAISE EXCEPTION '09: stale lease settled'; END IF;
END $$;

-- 10: correct lease token can finish and cannot be reused.
UPDATE p5_inbox_lab.deliveries SET state='processed',lease_token=NULL,lease_expires_at=NULL
 WHERE event_id='n1' AND tenant_id='north' AND state='processing'
  AND lease_token='11111111-1111-4111-8111-111111111111'::uuid;
DO $$ BEGIN
 IF (SELECT state FROM p5_inbox_lab.deliveries WHERE event_id='n1')<>'processed' THEN
  RAISE EXCEPTION '10: authorized acknowledgement missing'; END IF;
END $$;

-- 11: owner isolation holds for the UPDATE path too.
SELECT set_config('p5.tenant_id','south',true);
UPDATE p5_inbox_lab.deliveries SET attempts=9 WHERE tenant_id='north' AND event_id='n2';
SELECT set_config('p5.tenant_id','north',true);
DO $$ BEGIN
 IF (SELECT attempts FROM p5_inbox_lab.deliveries WHERE event_id='n2')<>0 THEN
  RAISE EXCEPTION '11: cross tenant update applied'; END IF;
END $$;

-- 12: pending candidate matches known positive fixture.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM p5_inbox_lab.deliveries
  WHERE state='pending' AND attempts=0 AND next_at <= clock_timestamp()) THEN
  RAISE EXCEPTION '12: pending candidate absent'; END IF;
END $$;

-- 13: indexes are present for ready-queue and expired lease scans.
DO $$ BEGIN
 IF (SELECT count(*) FROM pg_indexes WHERE schemaname='p5_inbox_lab'
  AND indexname IN ('deliveries_ready_idx','deliveries_lease_idx'))<>2 THEN
  RAISE EXCEPTION '13: indexes missing'; END IF;
END $$;

-- 14: attempts range and lease constraints are enforced.
DO $$ BEGIN
 BEGIN
  UPDATE p5_inbox_lab.deliveries SET attempts=21 WHERE event_id='n2';
  RAISE EXCEPTION '14: invalid attempts accepted';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
END $$;

-- 15: nullable lease state only permitted outside processing.
DO $$ BEGIN
 BEGIN
  UPDATE p5_inbox_lab.deliveries SET state='processing' WHERE event_id='n2';
  RAISE EXCEPTION '15: missing lease accepted';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
END $$;

-- 16: cross-tenant primary keys do not collide and each tenant sees only its own.
SELECT set_config('p5.tenant_id','south',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_inbox_lab.deliveries)<>1 THEN
  RAISE EXCEPTION '16: tenant key collision'; END IF;
END $$;
SELECT 'P5_INBOX_SQL_16_ASSERTIONS_PASSED' AS qualification_marker;
ROLLBACK;
