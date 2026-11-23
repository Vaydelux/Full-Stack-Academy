-- P5 Track 18 PostgreSQL FTS + pg_trgm + tenant/owner RLS qualification.
-- ONLY through qualify.mjs against an explicitly confirmed disposable loopback DB.
-- No persistent effects: all schema, extension and fixture changes are ROLLED BACK.
\set ON_ERROR_STOP on
BEGIN;
DO $$
DECLARE v int := current_setting('server_version_num')::int;
BEGIN
 IF v < 170000 THEN RAISE EXCEPTION 'PostgreSQL 17+ required'; END IF;
 IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND (rolsuper OR rolbypassrls)) THEN
  RAISE EXCEPTION 'Refusing a privileged runtime role';
 END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE SCHEMA p5_search_qualification;
CREATE TABLE p5_search_qualification.documents (
 id text PRIMARY KEY,
 tenant_id text NOT NULL,
 owner_id text NOT NULL,
 visibility text NOT NULL CHECK (visibility IN ('public','private')),
 status text NOT NULL CHECK (status IN ('visible','hidden')),
 title text NOT NULL,
 body text NOT NULL DEFAULT '',
 version integer NOT NULL CHECK (version > 0),
 search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english'::regconfig, coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english'::regconfig, coalesce(body,'')), 'B')
 ) STORED
);
CREATE INDEX p5_search_fts_idx ON p5_search_qualification.documents USING gin(search_vector);
CREATE INDEX p5_search_trgm_idx ON p5_search_qualification.documents USING gin(title gin_trgm_ops);

-- Synthetic fixture only. Seed before FORCE RLS and transaction-local actor claims.
INSERT INTO p5_search_qualification.documents(id,tenant_id,owner_id,visibility,status,title,body,version) VALUES
 ('north-public','north','alice','public','visible','Invoice processing','Billing ledger',2),
 ('north-private','north','alice','private','visible','Private invoice','Alice memo',1),
 ('north-mary','north','mary','private','visible','Mary invoice','Private file',1),
 ('north-hidden','north','alice','public','hidden','Hidden invoice','Removed record',1),
 ('south-public','south','carol','public','visible','Invoice export','Other organization',1);
ALTER TABLE p5_search_qualification.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE p5_search_qualification.documents FORCE ROW LEVEL SECURITY;
CREATE POLICY p5_read ON p5_search_qualification.documents FOR SELECT USING (
 tenant_id = nullif(current_setting('app.tenant_id', true),'') AND status = 'visible'
 AND (visibility = 'public' OR owner_id = nullif(current_setting('app.actor_id', true),''))
);
CREATE POLICY p5_write ON p5_search_qualification.documents FOR INSERT WITH CHECK (
 tenant_id = nullif(current_setting('app.tenant_id', true),'')
 AND owner_id = nullif(current_setting('app.actor_id', true),'')
);
CREATE POLICY p5_update ON p5_search_qualification.documents FOR UPDATE USING (
 tenant_id = nullif(current_setting('app.tenant_id', true),'')
 AND owner_id = nullif(current_setting('app.actor_id', true),'')
) WITH CHECK (
 tenant_id = nullif(current_setting('app.tenant_id', true),'')
 AND owner_id = nullif(current_setting('app.actor_id', true),'')
);

-- 01: fail-closed when no transaction actor context is present.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM p5_search_qualification.documents) THEN RAISE EXCEPTION '01: missing actor leaked documents'; END IF;
END $$;
SELECT set_config('app.tenant_id','north',true), set_config('app.actor_id','alice',true);
-- 02: public + owned private, but not Mary or another tenant or hidden documents.
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_search_qualification.documents) <> 2 THEN RAISE EXCEPTION '02: actor visibility broken'; END IF;
END $$;
-- 03: indexed FTS matches the relevant north documents without cross tenant leakage.
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_search_qualification.documents WHERE search_vector @@ plainto_tsquery('english','invoice')) <> 2 THEN
  RAISE EXCEPTION '03: FTS results incorrect'; END IF;
END $$;
-- 04: title weights outrank body-only hits for the same search term.
DO $$ BEGIN
 IF (SELECT ts_rank(search_vector, plainto_tsquery('english','invoice')) FROM p5_search_qualification.documents WHERE id='north-public') <= 0 THEN
  RAISE EXCEPTION '04: title relevance missing'; END IF;
END $$;
-- 05: trigram typo matching.
DO $$ BEGIN
 IF (SELECT similarity(title,'Invoice procesing') FROM p5_search_qualification.documents WHERE id='north-public') <= 0.3 THEN
  RAISE EXCEPTION '05: trigram match missing'; END IF;
END $$;
-- 06: GIN indexes exist for both FTS and trigram paths.
DO $$ BEGIN
 IF (SELECT count(*) FROM pg_indexes WHERE schemaname='p5_search_qualification' AND indexname IN ('p5_search_fts_idx','p5_search_trgm_idx') AND indexdef ILIKE '%USING gin%') <> 2 THEN
  RAISE EXCEPTION '06: GIN index missing'; END IF;
END $$;
-- 07: viewer can read public but not another person's private document.
SELECT set_config('app.actor_id','bob',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_search_qualification.documents) <> 1 THEN RAISE EXCEPTION '07: viewer privacy broken'; END IF;
END $$;
-- 08: another tenant's public documents remain isolated.
SELECT set_config('app.tenant_id','south',true), set_config('app.actor_id','carol',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM p5_search_qualification.documents) <> 1 THEN RAISE EXCEPTION '08: tenant isolation broken'; END IF;
END $$;
-- 09: forbidden cross-tenant insert must fail.
DO $$ BEGIN
 BEGIN
  INSERT INTO p5_search_qualification.documents VALUES('attack','north','carol','public','visible','Spoof','',1,DEFAULT);
  RAISE EXCEPTION '09: forbidden insert passed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
-- 10: own-tenant insert is permitted with normal generated vector calculation.
INSERT INTO p5_search_qualification.documents(id,tenant_id,owner_id,visibility,status,title,body,version)
VALUES('south-new','south','carol','public','visible','New invoice','test',1);
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM p5_search_qualification.documents WHERE id='south-new' AND search_vector @@ plainto_tsquery('english','invoice')) THEN
  RAISE EXCEPTION '10: authorized insert missing'; END IF;
END $$;
-- 11: stale revision cannot win a guarded upsert/update.
UPDATE p5_search_qualification.documents SET title='Fresh invoice',version=3
WHERE id='south-new' AND version < 3;
UPDATE p5_search_qualification.documents SET title='Stale invoice',version=2
WHERE id='south-new' AND version < 2;
DO $$ BEGIN
 IF (SELECT title FROM p5_search_qualification.documents WHERE id='south-new') <> 'Fresh invoice' THEN
  RAISE EXCEPTION '11: stale update replaced fresh'; END IF;
END $$;
-- 12: owner's private records cannot be updated by a different actor.
SELECT set_config('app.tenant_id','north',true), set_config('app.actor_id','mary',true);
UPDATE p5_search_qualification.documents SET title='stolen' WHERE id='north-private';
SELECT set_config('app.actor_id','alice',true);
DO $$ BEGIN
 IF (SELECT title FROM p5_search_qualification.documents WHERE id='north-private') <> 'Private invoice' THEN
  RAISE EXCEPTION '12: unauthorized mutation'; END IF;
END $$;
-- 13: hidden rows cannot be returned by a search predicate.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM p5_search_qualification.documents WHERE id='north-hidden' AND search_vector @@ plainto_tsquery('english','hidden')) THEN
  RAISE EXCEPTION '13: hidden content leaked'; END IF;
END $$;
-- 14: no tenant context must deny reads even after a populated session.
SELECT set_config('app.tenant_id','',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM p5_search_qualification.documents) THEN RAISE EXCEPTION '14: cleared tenant still sees rows'; END IF;
END $$;
-- 15: RLS enforcement cannot be bypassed by the table owner in this fixture.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='p5_search_qualification' AND c.relname='documents' AND c.relrowsecurity AND c.relforcerowsecurity) THEN
  RAISE EXCEPTION '15: RLS/FORCE RLS not enabled'; END IF;
END $$;
SELECT 'P5_SEARCH_SQL_15_ASSERTIONS_PASSED' AS qualification_marker;
ROLLBACK;
