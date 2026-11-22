DO $accept$
DECLARE rejected boolean := false;
BEGIN
 INSERT INTO lesson_attachments VALUES (1,'alpha',10,'report.pdf');
 BEGIN
   INSERT INTO lesson_attachments VALUES (2,'alpha',20,'private.pdf');
 EXCEPTION WHEN foreign_key_violation THEN rejected := true;
 END;
 IF NOT rejected
 THEN RAISE EXCEPTION '12.02.04 cross-tenant project reference accepted'; END IF;
 IF (SELECT count(*) FROM lesson_attachments) <> 1
 THEN RAISE EXCEPTION '12.02.04 invalid attachment persisted'; END IF;
END $accept$;
