\set ON_ERROR_STOP on
-- Administrative fixture operation, deliberately separate from user actions.
BEGIN;
WITH changed AS (
 UPDATE :"schema".memberships SET active=false WHERE user_id=:'user_id' AND active=true RETURNING user_id
)
SELECT json_build_object('revoked',count(*))::text FROM changed;
COMMIT;
