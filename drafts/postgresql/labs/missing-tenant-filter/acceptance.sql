DO $accept$
BEGIN
 IF (SELECT count(*) FROM lesson_result)<>2
  OR NOT EXISTS(SELECT 1 FROM lesson_result WHERE id=101 AND tenant_id='alpha')
  OR NOT EXISTS(SELECT 1 FROM lesson_result WHERE id=103 AND tenant_id='alpha')
  OR EXISTS(SELECT 1 FROM lesson_result WHERE tenant_id='beta')
 THEN RAISE EXCEPTION '12.02.08 missing tenant filter leaked data'; END IF;
END $accept$;
