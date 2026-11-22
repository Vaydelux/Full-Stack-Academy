-- Shared disposable transaction/concurrency teaching dataset.
CREATE TEMP TABLE training_wallets(tenant_id text NOT NULL,id text NOT NULL,balance integer NOT NULL CHECK(balance>=0),version integer NOT NULL DEFAULT 1,PRIMARY KEY(tenant_id,id));
INSERT INTO training_wallets VALUES('alpha','A',10,1),('alpha','B',2,1),('beta','A',20,1);
CREATE TEMP TABLE training_jobs(id integer PRIMARY KEY,status text NOT NULL CHECK(status IN('ready','running','done')));
INSERT INTO training_jobs VALUES(1,'ready'),(2,'ready'),(3,'done');
CREATE TEMP TABLE training_requests(tenant_id text NOT NULL,request_key text NOT NULL,result_id integer NOT NULL,PRIMARY KEY(tenant_id,request_key));
CREATE TEMP TABLE training_events(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,tenant_id text NOT NULL,event_kind text NOT NULL,amount integer NOT NULL);
