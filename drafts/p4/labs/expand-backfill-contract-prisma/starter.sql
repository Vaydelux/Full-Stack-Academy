-- Existing rows have no value for the new column.
ALTER TABLE training_tasks ADD COLUMN priority integer NOT NULL;
