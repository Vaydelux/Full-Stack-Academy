CREATE TEMP TABLE lesson_labels (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 label text NOT NULL,
 deleted_at timestamptz,
 UNIQUE (tenant_id, label)
);
CREATE TEMP TABLE lesson_label_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 label_id integer NOT NULL REFERENCES lesson_labels(id),
 tenant_id text NOT NULL,
 action text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now()
);
