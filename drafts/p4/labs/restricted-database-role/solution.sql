-- Isolated DBA-controlled test instance only; use a real secret store.
CREATE ROLE academy_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
GRANT USAGE ON SCHEMA app TO academy_app;
GRANT SELECT, INSERT, UPDATE ON app.tasks TO academy_app;
-- Configure runtime login/role inheritance separately and test denial.
