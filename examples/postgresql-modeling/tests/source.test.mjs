import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectModelingDrafts, matchesInstructorSources } from '../scripts/verify-source.mjs';
import { validateDatabaseConnection } from '../scripts/qualify.mjs';

const fence=String.fromCharCode(96).repeat(3);
test('all eight canonical 12.02 lesson and lab sources have unique IDs',()=>{
 const report=inspectModelingDrafts();
 assert.deepEqual(report.issues,[]);
 assert.equal(report.drafted,8);
 assert.equal(new Set(report.records.map(r=>r.slug)).size,8);
});
test('source integrity never counts draft lessons as published',()=>{
 const report=inspectModelingDrafts();
 assert.equal(report.publishedUnchanged,338);
 assert.equal(report.realPostgresExecuted,false);
 assert.equal(report.canPublish,false);
});
test('SQL examples match starter and instructor exactly',()=>{
 const text=fence+'sql\nSELECT 0;\n'+fence+'\n'+fence+'sql\nSELECT 1;\n'+fence;
 assert.equal(matchesInstructorSources(text,'SELECT 0;','SELECT 1;'),true);
 assert.equal(matchesInstructorSources(text,'SELECT 0;','SELECT 2;'),false);
 assert.equal(matchesInstructorSources(text,'SELECT 2;','SELECT 1;'),false);
});
test('source integrity rejects absent and extra SQL blocks',()=>{
 const one=fence+'sql\nSELECT 1;\n'+fence;
 assert.equal(matchesInstructorSources(one,'SELECT 0;','SELECT 1;'),false);
 assert.equal(matchesInstructorSources(one+'\n'+one+'\n'+one,'SELECT 1;','SELECT 1;'),false);
});
test('database gate fails closed without explicit opt-in',()=>{
 assert.throws(()=>validateDatabaseConnection('postgres://u:p@127.0.0.1/academy_test','NO'),/ACADEMY_ISOLATED_PG/);
});
test('database gate refuses production-like database and remote hosts',()=>{
 for(const url of ['postgres://u:p@db.example.com/academy_test',
  'postgres://u:p@127.0.0.1/prod','https://u:p@localhost/academy_test']){
  assert.throws(()=>validateDatabaseConnection(url,'YES'));
 }
});
test('database gate accepts explicit local test-only connection',()=>{
 assert.deepEqual(validateDatabaseConnection('postgres://u:p@localhost:5432/academy_test','YES'),
 {host:'localhost',port:'5432',database:'academy_test',user:'u',password:'p'});
});
