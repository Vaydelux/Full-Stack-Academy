ALTER TABLE ops_tasks ADD COLUMN priority integer;
UPDATE ops_tasks SET priority=CASE WHEN state='open' THEN 2 ELSE 1 END;
ALTER TABLE ops_tasks ALTER COLUMN priority SET NOT NULL;
