CREATE TEMP TABLE lesson_unique_inventory(tenant_id text NOT NULL,sku text NOT NULL,UNIQUE(tenant_id,sku));
