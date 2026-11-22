CREATE TEMP TABLE lesson_claim AS
WITH claimed AS (
 UPDATE training_jobs SET status='running'
 WHERE id=(SELECT id FROM training_jobs WHERE status='ready' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1)
 RETURNING id,status
) SELECT id,status FROM claimed;
