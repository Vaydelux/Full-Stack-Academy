DO $accept$
BEGIN
 INSERT INTO lesson_memberships VALUES ('alpha',1,10);
 BEGIN
   INSERT INTO lesson_memberships VALUES ('alpha',1,11);
 EXCEPTION WHEN unique_violation THEN
   RAISE EXCEPTION '12.02.03 valid second membership blocked';
 END;
 IF (SELECT count(*) FROM lesson_memberships WHERE member_id=1 AND tenant_id='alpha') <> 2
 THEN RAISE EXCEPTION '12.02.03 missing many-to-many membership'; END IF;
END $accept$;
