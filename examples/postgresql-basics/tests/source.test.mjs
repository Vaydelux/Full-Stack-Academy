import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectPostgresDrafts, checkSnippetParity } from '../scripts/verify-source.mjs';
import { validateTestDb } from '../scripts/qualify.mjs';
const fence=String.fromCharCode(96).repeat(3);
test('eight canonical lesson drafts map to real SQL exercises',()=>{
 const status=inspectPostgresDrafts();
 assert.deepEqual(status.issues,[]);
 assert.equal(status.drafted,8);
 assert.equal(new Set(status.entries.map(row=>row.id)).size,8);
});
test('draft source audit does not claim SQL runtime or publication',()=>{
 const status=inspectPostgresDrafts();
 assert.equal(status.publishedUnchanged,338);
 assert.equal(status.realPostgresExecuted,false);
 assert.equal(status.canPublish,false);
});
test('two SQL examples must match checked-in source exactly',()=>{
 const mdx=fence+'sql\nSELECT 0;\n'+fence+'\n'+fence+'sql\nSELECT 1;\n'+fence;
 assert.equal(checkSnippetParity(mdx,'SELECT 0;','SELECT 1;'),true);
 assert.equal(checkSnippetParity(mdx,'SELECT 2;','SELECT 1;'),false);
 assert.equal(checkSnippetParity(mdx,'SELECT 0;','SELECT 2;'),false);
});
test('missing or extra example fences are rejected',()=>{
 const mdx=fence+'sql\nSELECT 0;\n'+fence+'\n'+fence+'sql\nSELECT 1;\n'+fence;
 assert.equal(checkSnippetParity(fence+'sql\nSELECT 1;\n'+fence,'SELECT 0;','SELECT 1;'),false);
 assert.equal(checkSnippetParity(mdx+'\n'+fence+'sql\nSELECT 2;\n'+fence,'SELECT 0;','SELECT 1;'),false);
});
test('real DB qualifier rejects absent opt-in',()=>{
 assert.throws(()=>validateTestDb('postgres://u:p@localhost/academy_test','NO'),/ACADEMY_ISOLATED_PG/);
});
test('real DB qualifier rejects remote and unrelated databases',()=>{
 for(const target of ['postgres://u:p@production.example.com/academy_test',
  'postgres://u:p@localhost/erp','https://localhost/academy_test']){
  assert.throws(()=>validateTestDb(target,'YES'));
 }
});
test('real DB qualifier accepts isolated local test hosts only',()=>{
 assert.equal(validateTestDb('postgres://u:p@127.0.0.1:5432/academy_test','YES'),
  'postgres://u:p@127.0.0.1:5432/academy_test');
});
