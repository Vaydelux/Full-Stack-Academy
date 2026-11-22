CREATE TEMP TABLE lesson_memberships (
 tenant_id text NOT NULL,
 member_id integer NOT NULL,
 project_id integer NOT NULL,
 PRIMARY KEY (tenant_id, member_id),
 FOREIGN KEY (tenant_id,member_id) REFERENCES modeling_members(tenant_id,id),
 FOREIGN KEY (tenant_id,project_id) REFERENCES modeling_projects(tenant_id,id)
);
