DO $check$ DECLARE denied boolean:=false; BEGIN
 INSERT INTO lesson_unique_inventory VALUES('alpha','S1');
 BEGIN INSERT INTO lesson_unique_inventory VALUES('alpha','S1'); EXCEPTION WHEN unique_violation THEN denied:=true; END;
 INSERT INTO lesson_unique_inventory VALUES('beta','S1');
 IF NOT denied OR (SELECT count(*) FROM lesson_unique_inventory)<>2 THEN RAISE EXCEPTION '12.03.06 duplicate tenant SKU was not rejected'; END IF;
END $check$;
