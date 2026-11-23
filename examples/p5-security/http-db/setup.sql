\set ON_ERROR_STOP on
BEGIN;
CREATE ROLE :"runtime_role" NOLOGIN NOSUPERUSER NOBYPASSRLS;
GRANT :"runtime_role" TO CURRENT_USER;
CREATE SCHEMA :"schema";
CREATE TABLE :"schema".users (id text PRIMARY KEY, active boolean NOT NULL DEFAULT true);
CREATE TABLE :"schema".memberships (user_id text NOT NULL REFERENCES :"schema".users(id),tenant_id text NOT NULL,role text NOT NULL CHECK (role IN ('owner','editor','viewer')),active boolean NOT NULL DEFAULT true,PRIMARY KEY(user_id,tenant_id));
CREATE TABLE :"schema".documents (id text PRIMARY KEY,tenant_id text NOT NULL,title text NOT NULL,locked boolean NOT NULL DEFAULT false,deleted boolean NOT NULL DEFAULT false);
INSERT INTO :"schema".users (id) VALUES ('alice'),('bob'),('viewer');
INSERT INTO :"schema".users(id,active) VALUES ('suspended',false);
INSERT INTO :"schema".memberships(user_id,tenant_id,role) VALUES ('alice','alpha','owner'),('bob','beta','owner'),('viewer','alpha','viewer'),('suspended','alpha','owner');
INSERT INTO :"schema".documents(id,tenant_id,title,locked) VALUES ('alpha-1','alpha','Alpha',false),('beta-1','beta','Beta',false),('alpha-locked','alpha','Locked',true);
INSERT INTO :"schema".documents(id,tenant_id,title,deleted) VALUES ('alpha-deleted','alpha','Deleted',true);
REVOKE ALL ON SCHEMA :"schema" FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA :"schema" FROM PUBLIC;
GRANT USAGE ON SCHEMA :"schema" TO :"runtime_role";
GRANT SELECT ON :"schema".users, :"schema".memberships TO :"runtime_role";
GRANT SELECT, UPDATE(title), DELETE ON :"schema".documents TO :"runtime_role";
ALTER TABLE :"schema".documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE :"schema".documents FORCE ROW LEVEL SECURITY;
CREATE POLICY p5_select ON :"schema".documents FOR SELECT USING (
 NOT deleted AND EXISTS (
 SELECT 1 FROM :"schema".memberships m JOIN :"schema".users u ON u.id=m.user_id
 WHERE m.user_id=current_setting('p5.actor',true) AND u.active AND m.active AND m.tenant_id=documents.tenant_id));
CREATE POLICY p5_update ON :"schema".documents FOR UPDATE USING (
 NOT deleted AND NOT locked AND EXISTS (
 SELECT 1 FROM :"schema".memberships m JOIN :"schema".users u ON u.id=m.user_id
 WHERE m.user_id=current_setting('p5.actor',true) AND u.active AND m.active AND m.tenant_id=documents.tenant_id AND m.role IN ('owner','editor')))
 WITH CHECK (NOT deleted AND NOT locked AND EXISTS (
 SELECT 1 FROM :"schema".memberships m JOIN :"schema".users u ON u.id=m.user_id
 WHERE m.user_id=current_setting('p5.actor',true) AND u.active AND m.active AND m.tenant_id=documents.tenant_id AND m.role IN ('owner','editor')));
CREATE POLICY p5_delete ON :"schema".documents FOR DELETE USING (
 NOT deleted AND EXISTS (
 SELECT 1 FROM :"schema".memberships m JOIN :"schema".users u ON u.id=m.user_id
 WHERE m.user_id=current_setting('p5.actor',true) AND u.active AND m.active AND m.tenant_id=documents.tenant_id AND m.role='owner'));
COMMIT;
\echo P5_HTTP_DB_SETUP_PASSED
