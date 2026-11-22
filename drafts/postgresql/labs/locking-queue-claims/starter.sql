CREATE TEMP TABLE lesson_claim AS
SELECT id,status FROM training_jobs WHERE status='ready' ORDER BY id LIMIT 1;
