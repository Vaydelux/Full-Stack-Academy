import test from 'node:test';
import assert from 'node:assert/strict';
import {checksum,verifyHistory} from './migration-history.mjs';
const expected=[{name:'20261125000000_initial',checksum:checksum('SELECT 1;')}];
const row=()=>({migration_name:expected[0].name,checksum:expected[0].checksum,finished_at:new Date(),rolled_back_at:null,applied_steps_count:1});
test('exact applied history matches but does not claim schema drift detection',()=>assert.deepEqual(verifyHistory(expected,[row()]),{applied:1,historyMatches:true,schemaDriftVerified:false}));
test('reject modified migration bytes',()=>assert.throws(()=>verifyHistory(expected,[{...row(),checksum:checksum('SELECT 2;')}]),/checksum/));
test('reject missing, duplicate, unexpected or unfinished histories',()=>{for(const rows of [[],[row(),row()],[{...row(),migration_name:'other'}],[{...row(),finished_at:null}],[{...row(),rolled_back_at:new Date()}],[{...row(),applied_steps_count:0}]])assert.throws(()=>verifyHistory(expected,rows));});
