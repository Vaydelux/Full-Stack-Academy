/** Release-only audit of independent, locked teaching workspaces. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve, join, isAbsolute, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectLockManifest } from '../examples/nestjs-vertical/scripts/lock-integrity.mjs';

export const WORKSPACES = Object.freeze(['examples/forms-query-vertical/react-client', 'examples/nestjs-vertical', 'examples/p5-distributed-runtime', 'examples/p6-runtime/websocket']);
const severities = ['info', 'low', 'moderate', 'high', 'critical'];
export function inspectWorkspaceAudit(result) {
  if (result?.error || result?.signal || ![0, 1].includes(result?.status)) return { passed: false, reason: 'audit-command-failed' };
  let report;
  try { report = JSON.parse(result.stdout); } catch { return { passed: false, reason: 'invalid-audit-json' }; }
  const counts = report?.metadata?.vulnerabilities;
  const findings = report?.vulnerabilities;
  if (report?.error || report?.auditReportVersion !== 2 || !counts || !findings || typeof findings !== 'object' || Array.isArray(findings) || !severities.every(s => Number.isSafeInteger(counts[s]) && counts[s] >= 0)) return { passed: false, reason: 'invalid-audit-report' };
  const actual = Object.fromEntries(severities.map(s => [s, 0]));
  for (const finding of Object.values(findings)) {
    if (!severities.includes(finding?.severity)) return { passed: false, reason: 'unknown-severity' };
    actual[finding.severity]++;
  }
  if (!severities.every(s => counts[s] === actual[s]) || counts.total !== Object.keys(findings).length) return { passed: false, reason: 'inconsistent-audit-counts' };
  if (actual.high || actual.critical) return { passed: false, reason: 'high-or-critical', counts: actual };
  // npm audit --audit-level=high should exit zero for lower severities only.
  if (result.status !== 0) return { passed: false, reason: 'unexpected-audit-exit', counts: actual };
  return { passed: true, counts: actual };
}

export function auditWorkspaces({ root, npm, execute = spawnSync, read = readFileSync }) {
  if (typeof npm !== 'string' || !isAbsolute(npm) || basename(npm) !== 'npm-cli.js') throw Error('Invoke through npm run with npm-cli.js');
  const results = [];
  for (const workspace of WORKSPACES) {
    const cwd = join(root, workspace);
    try {
      const lock = JSON.parse(read(join(cwd, 'package-lock.json'), 'utf8'));
      const manifest = JSON.parse(read(join(cwd, 'package.json'), 'utf8'));
      const integrity = inspectLockManifest(manifest, lock);
      if (!integrity.valid) throw Error(integrity.issues.join('; '));
    } catch { results.push({ workspace, passed: false, reason: 'missing-or-invalid-lock' }); continue; }
    for (const scope of ['runtime', 'all']) {
      const args = [npm, 'audit', '--json', '--audit-level=high', ...(scope === 'runtime' ? ['--omit=dev'] : [])];
      let outcome;
      try { outcome = inspectWorkspaceAudit(execute(process.execPath, args, { cwd, encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024, shell: false, windowsHide: true })); }
      catch { outcome = { passed: false, reason: 'audit-command-failed' }; }
      results.push({ workspace, scope, ...outcome });
    }
  }
  return { passed: results.length === WORKSPACES.length * 2 && results.every(r => r.passed), results };
}

const self = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === self) {
  try {
    const report = auditWorkspaces({ root: resolve(dirname(self), '..'), npm: process.env.npm_execpath });
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
