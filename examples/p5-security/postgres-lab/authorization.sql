\set ON_ERROR_STOP on
BEGIN;
CREATE TEMP TABLE users(id text PRIMARY KEY,active boolean NOT NULL) ON COMMIT DROP;
CREATE TEMP TABLE memberships(user_id text NOT NULL REFERENCES users(id),tenant_id text NOT NULL,role text NOT NULL CHECK (role IN ('viewer','editor','owner')),active boolean NOT NULL,PRIMARY KEY(user_id,tenant_id)) ON COMMIT DROP;
CREATE TEMP TABLE documents(id text PRIMARY KEY,tenant_id text NOT NULL,title text NOT NULL,locked boolean DEFAULT false,deleted boolean DEFAULT false) ON COMMIT DROP;
INSERT INTO users VALUES ('alice',true),('bob',true),('viewer',true),('suspended',false);
INSERT INTO memberships VALUES ('alice','alpha','owner',true),('bob','beta','owner',true),('viewer','alpha','viewer',true),('suspended','alpha','owner',true);
INSERT INTO documents(id,tenant_id,title) VALUES ('alpha-1','alpha','Alpha'),('beta-1','beta','Beta'),('alpha-locked','alpha','Locked');
UPDATE documents SET locked=true WHERE id='alpha-locked';
CREATE FUNCTION pg_temp.can_access(p_user text,p_document text,p_action text)
RETURNS boolean LANGUAGE sql STABLE AS $fn$
 SELECT EXISTS(SELECT 1 FROM pg_temp.documents d JOIN pg_temp.memberships m ON m.tenant_id=d.tenant_id JOIN pg_temp.users u ON u.id=m.user_id
 WHERE d.id=p_document AND u.id=p_user AND u.active AND m.active AND NOT d.deleted
 AND (p_action<>'write' OR NOT d.locked)
 AND CASE m.role WHEN 'viewer' THEN p_action='read' WHEN 'editor' THEN p_action IN ('read','write') WHEN 'owner' THEN p_action IN ('read','write','delete') ELSE false END)
$fn$;
DO $test$
DECLARE result boolean;n integer;
BEGIN
 SELECT pg_temp.can_access('alice','alpha-1','read') INTO result;
 IF result IS DISTINCT FROM true THEN RAISE EXCEPTION '01 own read'; END IF;
 SELECT pg_temp.can_access('alice','beta-1','read') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '02 cross tenant read'; END IF;
 SELECT pg_temp.can_access('alice','beta-1','write') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '03 cross tenant write'; END IF;
 SELECT pg_temp.can_access('alice','beta-1','delete') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '04 cross tenant delete'; END IF;
 SELECT pg_temp.can_access('viewer','alpha-1','read') INTO result;
 IF result IS DISTINCT FROM true THEN RAISE EXCEPTION '05 viewer read'; END IF;
 SELECT pg_temp.can_access('viewer','alpha-1','write') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '06 viewer write'; END IF;
 SELECT pg_temp.can_access('alice','alpha-locked','write') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '07 locked write'; END IF;
 SELECT pg_temp.can_access('suspended','alpha-1','read') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '08 suspended user'; END IF;
 SELECT pg_temp.can_access('alice','missing','read') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '09 missing document'; END IF;
 UPDATE pg_temp.documents SET title='stolen' WHERE id='beta-1' AND pg_temp.can_access('alice',id,'write');
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION '10 unauthorized mutation'; END IF;
 UPDATE pg_temp.documents SET title='updated' WHERE id='alpha-1' AND pg_temp.can_access('alice',id,'write');
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION '11 authorized mutation'; END IF;
END $test$;
UPDATE memberships SET active=false WHERE user_id='alice';
DO $revoke$
DECLARE n integer;result boolean;
BEGIN
 SELECT pg_temp.can_access('alice','alpha-1','read') INTO result;
 IF result IS DISTINCT FROM false THEN RAISE EXCEPTION '12 revocation read'; END IF;
 UPDATE pg_temp.documents SET title='replay' WHERE id='alpha-1' AND pg_temp.can_access('alice',id,'write');
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION '13 revoked mutation'; END IF;
 SELECT count(*) INTO n FROM pg_temp.documents WHERE id='alpha-1' AND title='updated';
 IF n<>1 THEN RAISE EXCEPTION '14 rollback integrity'; END IF;
END $revoke$;
ROLLBACK;
\echo P5_SQL_14_ASSERTIONS_PASSED
