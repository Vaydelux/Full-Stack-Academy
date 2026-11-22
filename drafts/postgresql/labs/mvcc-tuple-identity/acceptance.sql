DO $check$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='lesson_observation' AND column_name='tuple_creator') OR (SELECT count(*) FROM lesson_observation)<>2 THEN RAISE EXCEPTION '12.03.03 tuple version diagnostic missing'; END IF;
END $check$;
