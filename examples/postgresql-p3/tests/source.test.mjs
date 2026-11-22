import test from 'node:test';
import assert from 'node:assert/strict';
import {checkLabParity,extractSqlFences,inspectExtendedPostgresDrafts} from '../scripts/verify-source.mjs';

const fence=String.fromCharCode(96).repeat(3);
const article=(a,b)=>fence+'sql\n'+a+'\n'+fence+'\n'+fence+'sql\n'+b+'\n'+fence;
test('all 24 authored lessons match the canonical source inventory',()=>{
 const report=inspectExtendedPostgresDrafts();
 assert.deepEqual(report.problems,[]);
 assert.equal(report.drafted,24);
 assert.deepEqual(report.canonicalModules,['12.03','12.04','12.05']);
 assert.equal(new Set(report.items.map(x=>x.id)).size,24);
 assert.equal(new Set(report.items.map(x=>x.slug)).size,24);
});
test('semantic tests and manual evidence are separate',()=>{
 const report=inspectExtendedPostgresDrafts();
 assert.equal(report.sqlContracts,14);
 assert.equal(report.manualEvidenceRequired,10);
 assert.equal(report.realPostgresExecuted,false);
 assert.equal(report.readyToPublish,false);
 assert.equal(report.publishedUnchanged,338);
});
test('the source audit rejects missing, extra and incorrect SQL code fences',()=>{
 assert.equal(checkLabParity(article('SELECT 0;','SELECT 1;'),'SELECT 0;','SELECT 1;'),true);
 assert.equal(checkLabParity(article('SELECT 0;','SELECT 1;'),'SELECT 0;','SELECT 2;'),false);
 assert.equal(checkLabParity(article('SELECT 0;','SELECT 1;'),'SELECT 2;','SELECT 1;'),false);
 assert.equal(checkLabParity(article('SELECT 0;','SELECT 1;')+'\n'+fence+'sql\nSELECT 3;\n'+fence,'SELECT 0;','SELECT 1;'),false);
 assert.equal(checkLabParity(fence+'sql\nSELECT 1;\n'+fence,'SELECT 0;','SELECT 1;'),false);
});
test('draft article source exposes exactly two SQL blocks',()=>{
 assert.deepEqual(extractSqlFences(article('SELECT 0;','SELECT 1;')),['SELECT 0;','SELECT 1;']);
});
