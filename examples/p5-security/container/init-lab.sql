-- Executed by the postgres container only on a fresh tmpfs-backed database.
-- This role has CREATEROLE solely to exercise the separate RLS instructor lab.
CREATE ROLE p5_qualifier LOGIN CREATEROLE NOSUPERUSER NOBYPASSRLS PASSWORD 'p5_disposable_local_only';
GRANT CONNECT, CREATE ON DATABASE p5_lab_security TO p5_qualifier;
