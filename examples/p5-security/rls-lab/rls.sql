\set ON_ERROR_STOP on
-- Disposable-only lab: this file creates roles in the local PostgreSQL *cluster*.
-- It requires the dedicated p5_lab_* database and a CREATEROLE-equipped lab user.
-- All role/schema/table changes are transactional and rolled back on success/failure.
BEGIN;
CREATE ROLE p5_academy_alice NOLOGIN NOSUPERUSER NOBYPASSRLS;
CREATE ROLE p5_academy_bob NOLOGIN NOSUPERUSER NOBYPASSRLS;
CREATE ROLE p5_academy_viewer NOLOGIN NOSUPERUSER NOBYPASSRLS;
GRANT p5_academy_alice, p5_academy_bob, p5_academy_viewer TO CURRENT_USER;
CREATE SCHEMA p5_academy;
CREATE TABLE p5_academy.memberships (
  principal name NOT NULL,
  tenant_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner','editor','viewer')),
  active boolean NOT NULL DEFAULT true,
  PRIMARY KEY(principal, tenant_id)
);
CREATE TABLE p5_academy.documents (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  title text NOT NULL,
  locked boolean NOT NULL DEFAULT false,
  deleted boolean NOT NULL DEFAULT false
);
INSERT INTO p5_academy.memberships(principal,tenant_id,role) VALUES
 ('p5_academy_alice','alpha','owner'),
 ('p5_academy_bob','beta','owner'),
 ('p5_academy_viewer','alpha','viewer');
INSERT INTO p5_academy.documents(id,tenant_id,title) VALUES
 ('alpha-1','alpha','Alpha'),('beta-1','beta','Beta'),('alpha-locked','alpha','Locked');
UPDATE p5_academy.documents SET locked=true WHERE id='alpha-locked';
REVOKE ALL ON SCHEMA p5_academy FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA p5_academy FROM PUBLIC;
GRANT USAGE ON SCHEMA p5_academy TO p5_academy_alice,p5_academy_bob,p5_academy_viewer;
GRANT SELECT ON p5_academy.memberships TO p5_academy_alice,p5_academy_bob,p5_academy_viewer;
GRANT SELECT,UPDATE(title),DELETE ON p5_academy.documents TO p5_academy_alice,p5_academy_bob,p5_academy_viewer;
ALTER TABLE p5_academy.memberships ENABLE ROW LEVEL SECURITY;
-- Membership table owner must be able to revoke synthetic memberships;
-- unprivileged roles still obey RLS, but the owner bypasses it in this fixture.
ALTER TABLE p5_academy.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE p5_academy.documents FORCE ROW LEVEL SECURITY;
CREATE POLICY p5_membership_self ON p5_academy.memberships FOR SELECT
  USING(principal=current_user);
CREATE POLICY p5_doc_select ON p5_academy.documents FOR SELECT USING (
  NOT deleted AND EXISTS (
    SELECT 1 FROM p5_academy.memberships m
    WHERE m.principal=current_user AND m.active AND m.tenant_id=documents.tenant_id
  )
);
CREATE POLICY p5_doc_update ON p5_academy.documents FOR UPDATE
  USING (NOT deleted AND NOT locked AND EXISTS (
    SELECT 1 FROM p5_academy.memberships m
    WHERE m.principal=current_user AND m.active AND m.tenant_id=documents.tenant_id
      AND m.role IN ('owner','editor')
  ))
  WITH CHECK (NOT deleted AND NOT locked AND EXISTS (
    SELECT 1 FROM p5_academy.memberships m
    WHERE m.principal=current_user AND m.active AND m.tenant_id=documents.tenant_id
      AND m.role IN ('owner','editor')
  ));
CREATE POLICY p5_doc_delete ON p5_academy.documents FOR DELETE
  USING (NOT deleted AND EXISTS (
    SELECT 1 FROM p5_academy.memberships m
    WHERE m.principal=current_user AND m.active AND m.tenant_id=documents.tenant_id
      AND m.role='owner'
  ));
-- RLS is evaluated as current_user, which SET ROLE changes in this lab.
-- Real apps need a trusted identity-to-DB-role boundary; never let untrusted
-- clients choose their own role or connect with a table owner/BYPASSRLS role.
SET LOCAL ROLE p5_academy_alice;
DO $assert_alice$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM p5_academy.documents;
 IF n<>2 THEN RAISE EXCEPTION 'RLS_01 Alice sees only alpha'; END IF;
 SELECT count(*) INTO n FROM p5_academy.documents WHERE id='beta-1';
 IF n<>0 THEN RAISE EXCEPTION 'RLS_02 cross-tenant read leaked'; END IF;
 UPDATE p5_academy.documents SET title='Attack' WHERE id='beta-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_03 cross-tenant update succeeded'; END IF;
 UPDATE p5_academy.documents SET title='Attack' WHERE id='alpha-locked';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_04 locked row updated'; END IF;
 UPDATE p5_academy.documents SET title='Updated' WHERE id='alpha-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'RLS_05 own update denied'; END IF;
 DELETE FROM p5_academy.documents WHERE id='beta-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_06 cross-tenant delete succeeded'; END IF;
END $assert_alice$;
RESET ROLE;
SET LOCAL ROLE p5_academy_viewer;
DO $assert_viewer$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM p5_academy.documents WHERE tenant_id='alpha';
 IF n<>2 THEN RAISE EXCEPTION 'RLS_07 viewer own tenant read'; END IF;
 UPDATE p5_academy.documents SET title='Wrong' WHERE id='alpha-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_08 viewer write allowed'; END IF;
 DELETE FROM p5_academy.documents WHERE id='alpha-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_09 viewer delete allowed'; END IF;
 SELECT count(*) INTO n FROM p5_academy.memberships;
 IF n<>1 THEN RAISE EXCEPTION 'RLS_10 membership record leaked'; END IF;
END $assert_viewer$;
RESET ROLE;
-- Revocation is performed as the fixture owner, not by untrusted users.
UPDATE p5_academy.memberships SET active=false WHERE principal='p5_academy_alice';
SET LOCAL ROLE p5_academy_alice;
DO $assert_revoke$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM p5_academy.documents;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_11 revoked user can read'; END IF;
 UPDATE p5_academy.documents SET title='Replay' WHERE id='alpha-1';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'RLS_12 revoked user can write'; END IF;
END $assert_revoke$;
RESET ROLE;
SET LOCAL ROLE p5_academy_bob;
DO $assert_bob$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM p5_academy.documents;
 IF n<>1 THEN RAISE EXCEPTION 'RLS_13 Bob sees other tenant'; END IF;
 SELECT count(*) INTO n FROM p5_academy.documents WHERE id='beta-1' AND title='Beta';
 IF n<>1 THEN RAISE EXCEPTION 'RLS_14 Bob data changed by Alice'; END IF;
END $assert_bob$;
RESET ROLE;
ROLLBACK;
\echo P5_RLS_14_ASSERTIONS_PASSED
