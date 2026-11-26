import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { WORKSPACES, inspectWorkspaceAudit, auditWorkspaces } from '../scripts/audit-release-workspaces.mjs';
const report = (levels = [], status = 0) => {
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: levels.length };
  const vulnerabilities = Object.fromEntries(levels.map((severity, i) => { counts[severity]++; return ['pkg' + i, { severity }]; }));
  return { status, stdout: JSON.stringify({ auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: counts } }) };
};
const manifest = { name: 'fixture', version: '1.0.0', dependencies: { example: '^1.0.0' } };
const lock = JSON.stringify({ lockfileVersion: 3, packages: { '': manifest, 'node_modules/example': { version: '1.0.0', integrity: 'sha512-QUJDRA==' } } });
const readFixture = path => path.endsWith('package.json') ? JSON.stringify(manifest) : lock;
const options = { root: resolve('fixture'), npm: resolve('npm-cli.js'), read: readFixture };
test('zero or moderate findings pass only with successful audit exit', () => {
  assert.equal(inspectWorkspaceAudit(report()).passed, true);
  assert.equal(inspectWorkspaceAudit(report(['low', 'moderate'])).passed, true);
  assert.equal(inspectWorkspaceAudit(report(['moderate'], 1)).passed, false);
});
test('high and critical findings fail even when command exits zero', () => {
  for (const level of ['high', 'critical']) for (const status of [0, 1]) assert.equal(inspectWorkspaceAudit(report([level], status)).reason, 'high-or-critical');
});
test('timeouts, signals, malformed JSON, registry errors and inconsistent counts fail closed', () => {
  const mismatch = JSON.parse(report().stdout); mismatch.metadata.vulnerabilities.high = 1;
  for (const result of [{ ...report(), error: { code: 'ETIMEDOUT' } }, { ...report(), signal: 'SIGTERM' }, { status: 0, stdout: '{' }, { status: 0, stdout: '{"error":{"code":"ENOTFOUND"}}' }, { status: 0, stdout: JSON.stringify(mismatch) }, { ...report(), status: 2 }]) assert.equal(inspectWorkspaceAudit(result).passed, false);
});
test('each independent workspace receives runtime and full audits with explicit working directories', () => {
  const calls = [];
  const result = auditWorkspaces({ ...options, execute: (program, args, opts) => { calls.push({ program, args, opts }); return report(); } });
  assert.equal(result.passed, true); assert.equal(calls.length, 4);
  for (const [i, workspace] of WORKSPACES.entries()) {
    assert.equal(calls[i * 2].opts.cwd, resolve(options.root, workspace));
    assert.equal(calls[i * 2 + 1].opts.cwd, resolve(options.root, workspace));
    assert.ok(calls[i * 2].args.includes('--omit=dev')); assert.ok(!calls[i * 2 + 1].args.includes('--omit=dev'));
    assert.equal(calls[i * 2].opts.shell, false);
  }
});
test('missing lock and execution errors cannot produce successful aggregate', () => {
  let calls = 0;
  const result = auditWorkspaces({ ...options, read: path => { if (path.includes('nestjs-vertical')) throw Error('missing'); return readFixture(path); }, execute: () => { calls++; throw Error('registry unavailable'); } });
  assert.equal(calls, 2); assert.equal(result.passed, false);
  assert.ok(result.results.some(r => r.reason === 'missing-or-invalid-lock'));
  assert.throws(() => auditWorkspaces({ ...options, npm: 'npm' }), /npm-cli/);
});

test('manifest drift or missing direct integrity blocks audit before execution', () => {
  for (const mutate of [
    fixture => { fixture.packages[''].dependencies.example = '^2.0.0'; },
    fixture => { delete fixture.packages['node_modules/example'].integrity; },
    fixture => { delete fixture.packages['node_modules/example']; },
  ]) {
    const invalid = JSON.parse(lock); mutate(invalid);
    let calls = 0;
    const result = auditWorkspaces({ ...options, read: path => path.endsWith('package.json') ? JSON.stringify(manifest) : JSON.stringify(invalid), execute: () => { calls++; return report(); } });
    assert.equal(calls, 0);
    assert.equal(result.passed, false);
    assert.equal(result.results.length, WORKSPACES.length);
    assert.ok(result.results.every(item => item.reason === 'missing-or-invalid-lock'));
  }
});
