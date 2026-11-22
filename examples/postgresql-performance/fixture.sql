-- Temporary lab tables for PostgreSQL 12.04. No real user data.
CREATE TEMP TABLE perf_projects(id integer PRIMARY KEY,tenant_id text NOT NULL,name text NOT NULL);
CREATE TEMP TABLE perf_tasks(
 id integer PRIMARY KEY,tenant_id text NOT NULL,project_id integer NOT NULL REFERENCES perf_projects(id),
 created_at timestamptz NOT NULL,status text NOT NULL,title text NOT NULL,deleted_at timestamptz
);
INSERT INTO perf_projects VALUES (10,'alpha','Launch'),(11,'alpha','Docs'),(20,'beta','Private');
INSERT INTO perf_tasks(id,tenant_id,project_id,created_at,status,title,deleted_at) VALUES
(8,'alpha',10,'2026-01-08 00:00:00+00','todo','Top',NULL),
(7,'alpha',10,'2026-01-07 00:00:00+00','todo','Plan',NULL),
(6,'alpha',10,'2026-01-06 00:00:00+00','done','Ship',NULL),
(5,'alpha',11,'2026-01-05 00:00:00+00','todo','Review',NULL),
(4,'alpha',11,'2026-01-04 00:00:00+00','todo','Draft','2026-01-20 00:00:00+00'),
(3,'alpha',11,'2026-01-03 00:00:00+00','todo','Docs',NULL),
(2,'beta',20,'2026-01-09 00:00:00+00','todo','Secret',NULL),
(1,'alpha',10,'2026-01-01 00:00:00+00','done','Cleanup',NULL);
