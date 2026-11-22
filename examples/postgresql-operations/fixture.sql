-- Disposable per-connection TEMP fixtures; not a backup/restore artifact.
CREATE TEMP TABLE ops_tasks(id integer PRIMARY KEY,state text NOT NULL CHECK(state IN('open','closed')),description text NOT NULL);
INSERT INTO ops_tasks VALUES(1,'open','Draft'),(2,'open','Review'),(3,'closed','Shipped');
