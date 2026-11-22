DO $accept$
BEGIN
 IF to_regclass('pg_temp.lesson_contact_addresses') IS NULL
 THEN RAISE EXCEPTION '12.02.01 address relation missing'; END IF;
 INSERT INTO lesson_contacts (id, display_name) VALUES (1, 'Ada');
 INSERT INTO lesson_contact_addresses (contact_id, address)
 VALUES (1, 'ada@a.test'), (1, 'ada@b.test');
 IF (SELECT count(*) FROM lesson_contact_addresses WHERE contact_id=1) <> 2
 THEN RAISE EXCEPTION '12.02.01 one-to-many facts not stored'; END IF;
END $accept$;
