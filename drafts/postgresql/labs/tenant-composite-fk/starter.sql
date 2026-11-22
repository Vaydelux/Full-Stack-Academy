CREATE TEMP TABLE lesson_attachments (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 project_id integer NOT NULL,
 filename text NOT NULL
);
