import test from 'node:test';
import assert from 'node:assert/strict';
import {batchIds,batchModules,qualifyMetadata} from '../scripts/automated-batch-release.mjs';
test('canonical batch consists of exactly 72 lessons and nine complete modules',()=>{
 assert.equal(batchModules.length,9);assert.equal(batchIds.length,72);assert.equal(new Set(batchIds).size,72);
});
test('machine qualification never invents a human review date',()=>{
 const result=qualifyMetadata({id:batchIds[0],reviewedAt:'2000-01-01'},'2026-11-28',batchIds[0]);
 assert.equal(result.reviewedAt,null);assert.equal(result.automatedQualifiedAt,'2026-11-28');
 assert.throws(()=>qualifyMetadata({id:batchIds[0],reviewedAt:'2026-11-28'},'2026-11-28',batchIds[0]));
 assert.throws(()=>qualifyMetadata({id:'14.01.01',reviewedAt:'2000-01-01'},'2026-11-28','14.01.01'));
 assert.throws(()=>qualifyMetadata({id:batchIds[0],reviewedAt:'2000-01-01'},'2000-01-01',batchIds[0]));
});
