UPDATE training_wallets SET balance=balance-2 WHERE tenant_id='alpha' AND id='A';
UPDATE training_wallets SET balance=balance+2 WHERE tenant_id='alpha' AND id='B';
INSERT INTO training_events(tenant_id,event_kind,amount) VALUES('alpha','transfer.completed',2);
