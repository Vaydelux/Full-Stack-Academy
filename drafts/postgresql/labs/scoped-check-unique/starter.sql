CREATE TEMP TABLE lesson_inventory (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 sku text NOT NULL,
 quantity integer NOT NULL,
 UNIQUE (tenant_id, sku)
);
