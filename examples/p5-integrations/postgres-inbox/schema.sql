-- P5 instructor-only PostgreSQL inbox. Install ONLY in a disposable practice database.
-- Caller owns migration transaction; this file intentionally has no BEGIN / COMMIT.
-- Runtime must use a trusted server-owned, non-BYPASSRLS role and no public SQL access.
CREATE SCHEMA p5_inbox_lab;
REVOKE ALL ON SCHEMA p5_inbox_lab FROM PUBLIC;

CREATE TABLE p5_inbox_lab.deliveries (
 tenant_id text NOT NULL CHECK (length(tenant_id) BETWEEN 1 AND 100),
 provider text NOT NULL CHECK (length(provider) BETWEEN 1 AND 100),
 event_id text NOT NULL CHECK (length(event_id) BETWEEN 1 AND 100),
 payload_digest text NOT NULL CHECK (payload_digest ~ '^[a-f0-9]{64}$'),
 encrypted_body bytea NOT NULL,
 iv bytea NOT NULL CHECK (octet_length(iv) = 12),
 auth_tag bytea NOT NULL CHECK (octet_length(auth_tag) = 16),
 state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','processing','processed','dead-letter')),
 attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 20),
 next_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 lease_token uuid,
 lease_expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY (tenant_id, provider, event_id),
 CONSTRAINT processing_has_lease CHECK (
   (state='processing' AND lease_token IS NOT NULL AND lease_expires_at IS NOT NULL)
   OR (state<>'processing' AND lease_token IS NULL AND lease_expires_at IS NULL)
 ),
 CONSTRAINT attempts_consistent CHECK (state <> 'processing' OR attempts > 0)
);
CREATE INDEX deliveries_ready_idx ON p5_inbox_lab.deliveries(tenant_id, next_at, created_at)
 WHERE state IN ('pending','processing');
CREATE INDEX deliveries_lease_idx ON p5_inbox_lab.deliveries(tenant_id, lease_expires_at)
 WHERE state='processing';
ALTER TABLE p5_inbox_lab.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE p5_inbox_lab.deliveries FORCE ROW LEVEL SECURITY;
CREATE POLICY p5_tenant_read ON p5_inbox_lab.deliveries FOR SELECT
 USING (tenant_id = NULLIF(current_setting('p5.tenant_id', true), ''));
CREATE POLICY p5_tenant_insert ON p5_inbox_lab.deliveries FOR INSERT
 WITH CHECK (tenant_id = NULLIF(current_setting('p5.tenant_id', true), ''));
CREATE POLICY p5_tenant_update ON p5_inbox_lab.deliveries FOR UPDATE
 USING (tenant_id = NULLIF(current_setting('p5.tenant_id', true), ''))
 WITH CHECK (tenant_id = NULLIF(current_setting('p5.tenant_id', true), ''));
-- No DELETE policy: even a correctly scoped runtime actor cannot delete deliveries.

-- This is an instructional schema. In real deployments a DBA owns schema/migrations,
-- grants a narrowly scoped server role, revokes public schema access and verifies
-- row_security=on plus no SUPERUSER or BYPASSRLS privileges. GUC claims can be set
-- by any SQL-connected actor, so the runtime DB credential MUST NEVER be public.
