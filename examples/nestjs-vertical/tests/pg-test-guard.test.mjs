import test from 'node:test';
import assert from 'node:assert/strict';
import {isolatedPgConfig,verifyIsolatedPg} from './pg-test-guard.mjs';
const env={ACADEMY_ISOLATED_PG:'YES',PG_TEST_URL:'postgres://academy_user:example-password@127.0.0.1:5432/academy_test_nest'};
const config=isolatedPgConfig(env);
test('only explicit numeric-loopback test connection configuration is accepted',()=>{
 assert.equal(config.host,'127.0.0.1');assert.equal(config.database,'academy_test_nest');assert.equal(config.ssl,false);
 assert.equal(isolatedPgConfig({...env,PG_TEST_URL:env.PG_TEST_URL.replace('127.0.0.1','[::1]')}).host,'::1');
});
test('reject absent approval, remote host, URL overrides, production DB and missing credentials',()=>{
 assert.throws(()=>isolatedPgConfig({...env,ACADEMY_ISOLATED_PG:'NO'}));
 for(const url of ['', 'invalid',env.PG_TEST_URL.replace('127.0.0.1','localhost'),env.PG_TEST_URL.replace('127.0.0.1','db.example.com'),env.PG_TEST_URL+'?sslmode=require',env.PG_TEST_URL+'#x',env.PG_TEST_URL.replace('academy_test_nest','production'),env.PG_TEST_URL.replace(':example-password','')])assert.throws(()=>isolatedPgConfig({...env,PG_TEST_URL:url}));
});
const row={database:config.database,role:config.user,session_role:config.user,server:'127.0.0.1',version:170011,restricted:true,no_privileged_membership:true};
const client=rows=>({query:async()=>({rows})});
test('live identity contract accepts dedicated restricted PostgreSQL 17 session',async()=>{await verifyIsolatedPg(client([row]),config);});
test('identity contract rejects wrong database, user, session, endpoint, version and privileges',async()=>{
 for(const bad of [{database:'production'},{role:'postgres'},{session_role:'postgres'},{server:'10.0.0.1'},{version:160000},{version:180000},{restricted:false},{no_privileged_membership:false}])await assert.rejects(()=>verifyIsolatedPg(client([{...row,...bad}]),config));
 await assert.rejects(()=>verifyIsolatedPg(client([]),config));
});
