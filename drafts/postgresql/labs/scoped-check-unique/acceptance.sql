DO $accept$
DECLARE negative_rejected boolean := false; duplicate_rejected boolean := false;
BEGIN
 INSERT INTO lesson_inventory VALUES (1,'alpha','widget',5);
 BEGIN
  INSERT INTO lesson_inventory VALUES (2,'alpha','other',-3);
 EXCEPTION WHEN check_violation THEN negative_rejected:=true;
 END;
 BEGIN
  INSERT INTO lesson_inventory VALUES (3,'alpha','WIDGET',2);
 EXCEPTION WHEN unique_violation THEN duplicate_rejected:=true;
 END;
 IF NOT negative_rejected OR NOT duplicate_rejected
 THEN RAISE EXCEPTION '12.02.06 invalid quantity or case duplicate accepted'; END IF;
 IF (SELECT count(*) FROM lesson_inventory)<>1
 THEN RAISE EXCEPTION '12.02.06 rejected rows persisted'; END IF;
END $accept$;
