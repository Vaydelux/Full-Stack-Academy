CREATE TEMP TABLE lesson_inventory (
 id integer PRIMARY KEY,
 tenant_id text NOT NULL,
 sku text NOT NULL CHECK (length(btrim(sku)) >= 2),
 quantity integer NOT NULL CHECK (quantity >= 0)
);
CREATE UNIQUE INDEX lesson_inventory_tenant_sku_unique
 ON lesson_inventory (tenant_id, lower(sku));
