import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRootAudit} from '../scripts/root-audit-report.mjs';
function fixture(severity, status){
 const counts={info:0,low:0,moderate:0,high:0,critical:0,total:severity?1:0};
 if(severity) counts[severity]=1;
 return {status,stdout:JSON.stringify({auditReportVersion:2,metadata:{vulnerabilities:counts},vulnerabilities:severity?{pkg:{severity}}:{}})};
}
test('valid reports preserve findings for existing exception policy',()=>{
 for(const [level,status] of [[null,0],['moderate',0],['high',1],['critical',1]]) assert.ok(validateRootAudit(fixture(level,status)));
});
test('failed commands and contradictory reports cannot pass',()=>{
 for(const result of [fixture(null,1),fixture('high',0),fixture(null,2),{...fixture(null,0),signal:'SIGTERM'},{...fixture(null,0),error:Error('timeout')},{status:0,stdout:'{}'},fixture('unknown',0)]) assert.throws(()=>validateRootAudit(result));
});
test('inconsistent counts fail closed',()=>{
 const result=fixture('high',1);const report=JSON.parse(result.stdout);report.metadata.vulnerabilities.high=0;result.stdout=JSON.stringify(report);assert.throws(()=>validateRootAudit(result));
});
