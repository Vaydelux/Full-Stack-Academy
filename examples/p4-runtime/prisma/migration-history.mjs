import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const checksum=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyHistory(expected,rows){
 assert.ok(Array.isArray(expected)&&expected.length>0&&Array.isArray(rows));
 const names=expected.map(x=>x.name);assert.equal(new Set(names).size,names.length);
 for(const e of expected){assert.match(e.name,/^\d{14}_[a-z0-9_]+$/);assert.match(e.checksum,/^[a-f0-9]{64}$/);}
 assert.equal(rows.length,expected.length,'Unexpected migration history size');
 for(const e of expected){const matches=rows.filter(r=>r.migration_name===e.name);assert.equal(matches.length,1,'Missing or duplicate migration');const r=matches[0];assert.ok(r.finished_at instanceof Date&&!Number.isNaN(r.finished_at.getTime())&&r.rolled_back_at===null&&Number.isSafeInteger(r.applied_steps_count)&&r.applied_steps_count>0,'Incomplete migration');assert.ok(r.checksum===e.checksum,'Migration checksum mismatch');}
 return {applied:expected.length,historyMatches:true,schemaDriftVerified:false};
}
