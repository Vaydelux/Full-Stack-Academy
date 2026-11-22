DO $accept$
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint
   WHERE conrelid = 'pg_temp.lesson_accounts'::regclass AND contype='p'
 ) THEN RAISE EXCEPTION '12.02.02 primary key missing'; END IF;
 INSERT INTO lesson_accounts (tenant_id,email)
 VALUES ('alpha','shared@a.test'), ('beta','shared@a.test');
 IF (SELECT count(*) FROM lesson_accounts WHERE email='shared@a.test') <> 2
 THEN RAISE EXCEPTION '12.02.02 business key scoped incorrectly'; END IF;
END $accept$;
