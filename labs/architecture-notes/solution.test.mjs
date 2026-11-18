import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('includes status, context and rollback in rendered ADR',()=>{const text=api.formatADR({id:'0001',status:'proposed',title:'Cache hot lookups',context:'Synthetic evidence',decision:'Run a pilot',tradeoffs:'Memory and invalidation',rollback:'Disable cache'});assert.match(text,/# ADR-0001/);assert.match(text,/Status: proposed/);assert.match(text,/## Tradeoffs/);assert.match(text,/## Rollback/);});
test('rejects insufficient or unreviewed record shapes',()=>{const base={id:'0001',status:'proposed',title:'Test',context:'Evidence',decision:'Pilot',tradeoffs:'Cost',rollback:'Reverse'};assert.throws(()=>api.formatADR({...base,rollback:''}));assert.throws(()=>api.formatADR({...base,status:'done'}));assert.throws(()=>api.formatADR({...base,id:'1'}));});
