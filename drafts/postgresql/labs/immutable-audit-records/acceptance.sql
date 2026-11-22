DO $accept$
DECLARE updated_blocked boolean:=false; deleted_blocked boolean:=false;
BEGIN
 INSERT INTO lesson_audit(tenant_id,actor_id,action) VALUES('alpha',1,'task.created');
 BEGIN
  UPDATE lesson_audit SET action='task.deleted' WHERE id=1;
 EXCEPTION WHEN raise_exception THEN updated_blocked:=true;
 END;
 BEGIN
  DELETE FROM lesson_audit WHERE id=1;
 EXCEPTION WHEN raise_exception THEN deleted_blocked:=true;
 END;
 IF NOT updated_blocked OR NOT deleted_blocked
 THEN RAISE EXCEPTION '12.02.07 audit UPDATE or DELETE was permitted'; END IF;
 IF (SELECT count(*) FROM lesson_audit)<>1
 THEN RAISE EXCEPTION '12.02.07 audit row was destroyed'; END IF;
END $accept$;
