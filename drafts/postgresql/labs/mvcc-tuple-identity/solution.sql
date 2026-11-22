CREATE TEMP VIEW lesson_observation AS
SELECT id,balance,xmin::text AS tuple_creator FROM training_wallets WHERE tenant_id='alpha';
