CREATE TEMP TABLE lesson_contacts (
 id integer PRIMARY KEY,
 display_name text NOT NULL
);
CREATE TEMP TABLE lesson_contact_addresses (
 contact_id integer NOT NULL REFERENCES lesson_contacts(id),
 address text NOT NULL,
 PRIMARY KEY (contact_id, address)
);
