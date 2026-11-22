-- Disposable TEMP-table fixture for relational-modeling acceptance only.
CREATE TEMP TABLE modeling_members (
 tenant_id text NOT NULL, id integer NOT NULL, name text NOT NULL,
 PRIMARY KEY(tenant_id,id)
) ON COMMIT PRESERVE ROWS;
CREATE TEMP TABLE modeling_projects (
 tenant_id text NOT NULL, id integer NOT NULL, owner_id integer NOT NULL,
 name text NOT NULL,
 PRIMARY KEY (tenant_id,id),
 FOREIGN KEY (tenant_id,owner_id) REFERENCES modeling_members(tenant_id,id)
) ON COMMIT PRESERVE ROWS;
CREATE TEMP TABLE modeling_tasks (
 tenant_id text NOT NULL, id integer NOT NULL, project_id integer NOT NULL,
 title text NOT NULL, status text NOT NULL CHECK (status IN ('todo','done')),
 PRIMARY KEY (tenant_id,id),
 FOREIGN KEY (tenant_id,project_id) REFERENCES modeling_projects(tenant_id,id)
) ON COMMIT PRESERVE ROWS;
INSERT INTO modeling_members VALUES
('alpha',1,'Ana'),('alpha',2,'Bo'),('beta',1,'Eve');
INSERT INTO modeling_projects VALUES
('alpha',10,1,'Launch'),('alpha',11,1,'Docs'),('beta',20,1,'Private');
INSERT INTO modeling_tasks VALUES
('alpha',101,10,'Build','todo'),('alpha',102,10,'Ship','done'),
('alpha',103,11,'Review','todo'),('beta',201,20,'Secret','todo');
