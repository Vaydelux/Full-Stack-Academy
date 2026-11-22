DO $accept$
DECLARE duplicate_rejected boolean := false;
BEGIN
 IF to_regclass('pg_temp.lesson_label_history') IS NULL
 THEN RAISE EXCEPTION '12.02.05 archive history table missing'; END IF;
 INSERT INTO lesson_labels(id,tenant_id,label) VALUES (1,'alpha','Urgent');
 UPDATE lesson_labels SET deleted_at=now() WHERE id=1;
 BEGIN
  INSERT INTO lesson_labels(id,tenant_id,label) VALUES (2,'alpha','Urgent');
 EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION '12.02.05 archived label replacement blocked';
 END;
 BEGIN
  INSERT INTO lesson_labels(id,tenant_id,label) VALUES (3,'alpha','urgent');
 EXCEPTION WHEN unique_violation THEN duplicate_rejected:=true;
 END;
 IF NOT duplicate_rejected
 THEN RAISE EXCEPTION '12.02.05 active duplicate label permitted'; END IF;
 IF (SELECT count(*) FROM lesson_label_history WHERE label_id=1 AND action='archived')<>1
 THEN RAISE EXCEPTION '12.02.05 missing archive event'; END IF;
END $accept$;
