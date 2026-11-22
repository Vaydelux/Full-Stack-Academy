DO $lesson$
DECLARE rejected boolean;
BEGIN
 INSERT INTO lesson_notes(id, task_id, body) VALUES (1,100,'Reviewed');
 rejected := false;
 BEGIN
  INSERT INTO lesson_notes(id,task_id,body) VALUES (2,9999,'Orphan');
 EXCEPTION WHEN foreign_key_violation THEN rejected := true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION '12.01.05 orphan FK was accepted'; END IF;
 rejected := false;
 BEGIN
  INSERT INTO lesson_notes(id,task_id,body) VALUES (3,100,'  ');
 EXCEPTION WHEN check_violation THEN rejected := true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION '12.01.05 blank body was accepted'; END IF;
 IF (SELECT count(*) FROM lesson_notes) <> 1
 THEN RAISE EXCEPTION '12.01.05 invalid notes persisted'; END IF;
END $lesson$;
