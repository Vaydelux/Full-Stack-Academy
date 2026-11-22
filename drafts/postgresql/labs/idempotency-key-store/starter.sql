INSERT INTO training_requests(tenant_id,request_key,result_id) VALUES('alpha','charge-1',100) ON CONFLICT(tenant_id,request_key) DO UPDATE SET result_id=EXCLUDED.result_id;
INSERT INTO training_requests(tenant_id,request_key,result_id) VALUES('alpha','charge-1',999) ON CONFLICT(tenant_id,request_key) DO UPDATE SET result_id=EXCLUDED.result_id;
