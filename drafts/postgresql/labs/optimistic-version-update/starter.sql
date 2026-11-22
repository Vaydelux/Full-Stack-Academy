UPDATE training_wallets SET balance=balance-1,version=version+1 WHERE tenant_id='alpha' AND id='A';
UPDATE training_wallets SET balance=balance-3,version=version+1 WHERE tenant_id='alpha' AND id='A';
