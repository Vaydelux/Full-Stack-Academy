-- Disposable PostgreSQL session fixture; shared by all 12.01 labs.
-- The acceptance runner wraps fixture and lesson SQL in BEGIN/ROLLBACK.
CREATE TEMP TABLE academy_users (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 display_name text NOT NULL,
 email text,
 active boolean NOT NULL DEFAULT true
) ON COMMIT PRESERVE ROWS;
CREATE TEMP TABLE academy_projects (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 owner_id integer NOT NULL REFERENCES academy_users(id),
 title text NOT NULL
) ON COMMIT PRESERVE ROWS;
CREATE TEMP TABLE academy_tasks (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 project_id integer NOT NULL REFERENCES academy_projects(id),
 title text NOT NULL,
 status text NOT NULL CHECK (status IN ('todo','done')),
 estimate_hours integer,
 due_on date
) ON COMMIT PRESERVE ROWS;
INSERT INTO academy_users VALUES
(1,'alpha','Ana','ana@example.test',true),
(2,'alpha','Bo',NULL,true),
(3,'beta','Cy','cy@example.test',true),
(4,'alpha','Dee','dee@example.test',false);
INSERT INTO academy_projects VALUES
(10,'alpha',1,'Launch'),(11,'alpha',2,'Docs'),
(12,'alpha',1,'Empty'),(20,'beta',3,'Internal');
INSERT INTO academy_tasks VALUES
(100,'alpha',10,'Plan','done',3,'2026-12-01'),
(101,'alpha',10,'Build','todo',5,NULL),
(102,'alpha',11,'Review','done',2,'2026-12-03'),
(103,'beta',20,'Secret','todo',8,NULL),
(104,'alpha',11,'Draft','todo',NULL,NULL),
(105,'alpha',10,'Ship','done',1,'2026-12-05');
