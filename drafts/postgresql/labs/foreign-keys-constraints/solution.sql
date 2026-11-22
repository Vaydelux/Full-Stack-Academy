CREATE TEMP TABLE lesson_notes (
 id integer PRIMARY KEY,
 task_id integer NOT NULL REFERENCES academy_tasks(id),
 body text NOT NULL CHECK (length(btrim(body)) >= 3)
);
