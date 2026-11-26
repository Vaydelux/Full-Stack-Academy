export function validateRootAudit(result) {
 const levels = ['info','low','moderate','high','critical'];
 if (result?.error || result?.signal || ![0,1].includes(result?.status)) throw Error('Audit process failed');
 const report = JSON.parse(result.stdout);
 const findings = report?.vulnerabilities;
 const counts = report?.metadata?.vulnerabilities;
 if (report?.error || report?.auditReportVersion !== 2 || !findings || typeof findings !== 'object' || Array.isArray(findings) || !counts) throw Error('Invalid audit report');
 const actual = Object.fromEntries(levels.map(level => [level,0]));
 for (const item of Object.values(findings)) {
  if (!levels.includes(item?.severity)) throw Error('Unknown audit severity');
  actual[item.severity]++;
 }
 if (!levels.every(level => counts[level] === actual[level]) || counts.total !== Object.keys(findings).length) throw Error('Inconsistent audit counts');
 if (result.status !== (actual.high || actual.critical ? 1 : 0)) throw Error('Unexpected audit exit status');
 return report;
}
