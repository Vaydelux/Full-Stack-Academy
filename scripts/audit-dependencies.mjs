import { spawnSync } from 'node:child_process';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
let failed = false;
for (const scope of ['runtime', 'all']) {
  const result = spawnSync(npm, ['audit', '--json', ...(scope === 'runtime' ? ['--omit=dev'] : [])], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, shell: process.platform === 'win32' });
  let report;
  try { report = JSON.parse(result.stdout); } catch { console.error(scope, 'audit lookup failed', result.stderr); failed = true; continue; }
  if (report.error || !report.metadata || !report.vulnerabilities) { console.error(scope, 'audit lookup unavailable', report.error); failed = true; continue; }
  console.log(scope, JSON.stringify(report.metadata.vulnerabilities));
  for (const [name, detail] of Object.entries(report.vulnerabilities)) {
    if (!['high','critical'].includes(detail.severity)) continue;
    console.log(JSON.stringify({ scope, name, severity: detail.severity, direct: detail.isDirect, range: detail.range, nodes: detail.nodes, via: detail.via, fix: detail.fixAvailable }));
    if (scope === 'runtime') failed = true;
  }
}
if (failed) process.exitCode = 1;
