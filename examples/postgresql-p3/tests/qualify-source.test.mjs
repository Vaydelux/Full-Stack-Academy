import assert from 'node:assert/strict';
import test from 'node:test';
import {validateIsolatedPostgres} from '../scripts/qualify.mjs';

test('real SQL runner requires explicit opt-in',()=>{
 assert.throws(()=>validateIsolatedPostgres('postgres://tester:pass@127.0.0.1/academy_test','NO'),/ACADEMY_ISOLATED_PG/);
 assert.throws(()=>validateIsolatedPostgres('postgres://tester:pass@127.0.0.1/academy_test'),/ACADEMY_ISOLATED_PG/);
});
test('remote and production-like hosts are denied before any SQL',()=>{
 for(const url of ['postgres://tester:pass@prod.example.com/academy_test',
  'postgres://tester:pass@127.0.0.1/prod',
  'postgres://tester:pass@127.0.0.1/erp',
  'https://tester:pass@localhost/academy_test',
  'postgres://tester:pass@localhost/academy_test?host=prod.example.com']) {
  assert.throws(()=>validateIsolatedPostgres(url,'YES'));
 }
});
test('test connection must specify a real user and a dedicated test name',()=>{
 assert.throws(()=>validateIsolatedPostgres('postgres://127.0.0.1/academy_test','YES'),/role/);
 assert.throws(()=>validateIsolatedPostgres('postgres://u:p@127.0.0.1/postgres','YES'),/academy_test/);
});
test('local test database components are extracted but no I/O occurs',()=>{
 assert.deepEqual(validateIsolatedPostgres('postgres://tester:pass@127.0.0.1:5432/academy_test','YES'),
  {hostname:'127.0.0.1',database:'academy_test',user:'tester',password:'pass',port:'5432'});
});
