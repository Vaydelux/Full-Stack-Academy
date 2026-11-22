UPDATE training_jobs SET status='running'
WHERE id=(SELECT id FROM training_jobs WHERE status='ready' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1);
CREATE TEMP TABLE lesson_claim AS SELECT id,status FROM training_jobs WHERE status='running';
