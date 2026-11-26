import { validateRootAudit } from './root-audit-report.mjs';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const acceptedAdvisory = 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf';
const reviewUntil = '2026-12-02';
const allowedDevPackages = new Set(['@next/eslint-plugin-next','@typescript-eslint/eslint-plugin','@typescript-eslint/parser','@typescript-eslint/type-utils','@typescript-eslint/typescript-estree','@typescript-eslint/utils','eslint-config-next','eslint-import-resolver-typescript','fast-glob','fdir','micromatch','picomatch','tinyglobby','typescript-eslint']);

// Only the explicitly reviewed dev-only advisory tree is allowed temporarily.
// New advisories, new affected packages, unknown nodes, critical issues, runtime
// exposure, and expired exceptions must all fail closed.
function reviewedDevFinding(name, graph, ancestors = new Set()) {
  if (ancestors.has(name) || !allowedDevPackages.has(name)) return false;
  const item = graph[name];
  if (!item || item.severity === 'critical' || !item.nodes?.length ||
      !item.nodes.every(node => lock.packages[node]?.dev === true) || !item.via?.length) return false;
  const next = new Set([...ancestors, name]);
  return item.via.every(v => typeof v === 'string'
    ? reviewedDevFinding(v, graph, next)
    : v.url === acceptedAdvisory && v.name === 'picomatch' && v.severity === 'high');
}
let failed = false;
for (const scope of ['runtime', 'all']) {
  const result = spawnSync(npm, ['audit', '--json', '--audit-level=high', ...(scope === 'runtime' ? ['--omit=dev'] : [])], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 120000, shell: process.platform === 'win32' });
  let report;
  try { report = validateRootAudit(result); } catch { console.error(scope, 'audit lookup failed', result.stderr); failed = true; continue; }
  if (result.error || report.error || !report.metadata || !report.vulnerabilities) { console.error(scope, 'audit lookup unavailable', result.error ?? report.error); failed = true; continue; }
  console.log(scope, JSON.stringify(report.metadata.vulnerabilities));
  for (const [name, detail] of Object.entries(report.vulnerabilities)) {
    if (!['high','critical'].includes(detail.severity)) continue;
    const accepted = scope === 'all' && new Date().toISOString().slice(0,10) <= reviewUntil && reviewedDevFinding(name, report.vulnerabilities);
    console.log(JSON.stringify({ scope, name, severity: detail.severity, direct: detail.isDirect, range: detail.range, nodes: detail.nodes, via: detail.via, fix: detail.fixAvailable, temporarilyAccepted: accepted }));
    if (!accepted) failed = true;
  }
}
if (failed) process.exitCode = 1;
