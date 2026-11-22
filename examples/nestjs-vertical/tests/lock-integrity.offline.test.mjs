import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectLockManifest } from '../scripts/lock-integrity.mjs';

// All lock objects below exist ONLY in test memory. Never commit a fabricated package-lock.json.
const manifest = {
  name: '@academy/nestjs-lab', version: '0.1.0',
  dependencies: { '@nestjs/core': '^12.5.1' },
  devDependencies: { typescript: '^6.0.3' },
};
function fixture() {
  return {
    lockfileVersion: 3,
    packages: {
      '': { name: manifest.name, version: manifest.version,
        dependencies: { ...manifest.dependencies }, devDependencies: { ...manifest.devDependencies } },
      'node_modules/@nestjs/core': { version: '12.5.1', integrity: 'sha512-QUJDRA==' },
      'node_modules/typescript': { version: '6.0.3', integrity: 'sha512-QUJDRA==' },
    },
  };
}
function expectFailure(lock, fragment) {
  const result = inspectLockManifest(manifest, lock);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.includes(fragment)), JSON.stringify(result.issues));
}
test('lock guard accepts a structurally complete synthetic fixture, not actual npm proof', () => {
  assert.deepEqual(inspectLockManifest(manifest, fixture()), { valid: true, issues: [] });
});
test('lock guard rejects version 2 locks', () => {
  expectFailure({ ...fixture(), lockfileVersion: 2 }, 'npm v3');
});
test('lock guard rejects wrong root identity', () => {
  const lock = fixture();
  lock.packages[''].name = 'different-package';
  expectFailure(lock, 'Root name/version mismatch');
});
test('lock guard rejects missing direct dependency', () => {
  const lock = fixture();
  delete lock.packages['node_modules/@nestjs/core'];
  expectFailure(lock, 'Resolved package missing');
});
test('lock guard rejects integrity fields that are missing or malformed', () => {
  const lock = fixture();
  delete lock.packages['node_modules/typescript'].integrity;
  expectFailure(lock, 'integrity');
  lock.packages['node_modules/typescript'].integrity = 'sha512-not valid';
  expectFailure(lock, 'integrity');
});
test('lock guard rejects missing or extra root dependencies', () => {
  const missing = fixture();
  delete missing.packages[''].devDependencies.typescript;
  expectFailure(missing, 'devDependencies contains missing or extra');
  const extra = fixture();
  extra.packages[''].dependencies.unexpected = '^1.0.0';
  expectFailure(extra, 'dependencies contains missing or extra');
});
test('lock guard rejects mismatch between manifest and lock dependency specifications', () => {
  const lock = fixture();
  lock.packages[''].dependencies['@nestjs/core'] = '^11.0.0';
  expectFailure(lock, 'Root lock mismatch');
});
test('lock guard rejects missing root entry', () => {
  const lock = fixture();
  delete lock.packages[''];
  expectFailure(lock, 'root package missing');
});
