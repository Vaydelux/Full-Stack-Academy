import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(root, 'package-lock.json');
function fail(message) {
  console.error('NestJS runtime is NOT qualified: ' + message);
  process.exit(2);
}
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor !== 24 || nodeMinor < 9) {
  fail('Release qualification requires the project-pinned Node.js 24.9+ runtime; detected ' + process.version);
}
if (!fs.existsSync(lockPath)) {
  fail('Generate a genuine npm registry-resolved package-lock.json in examples/nestjs-vertical; never invent integrity data.');
}
let pkg, lock;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
} catch (error) {
  fail('Package manifest or lockfile cannot be parsed: ' + error.message);
}
if (lock.lockfileVersion !== 3 || !lock.packages?.['']) {
  fail('Expected a complete npm v3 lockfile with its root manifest.');
}
if (lock.packages[''].name !== pkg.name || lock.packages[''].version !== pkg.version) {
  fail('Lockfile root name/version differs from package.json.');
}
for (const section of ['dependencies', 'devDependencies']) {
  const expected = pkg[section] ?? {};
  const actual = lock.packages[''][section] ?? {};
  if (Object.keys(expected).length !== Object.keys(actual).length) {
    fail('Lockfile root ' + section + ' contains missing or extra packages.');
  }
  for (const [name, version] of Object.entries(expected)) {
    if (actual[name] !== version) fail('Root lock mismatch for ' + name + ' in ' + section);
    const installed = lock.packages['node_modules/' + name];
    if (!installed || typeof installed.version !== 'string') fail('Missing resolved package ' + name);
    if (!/^sha(512|1|256|384)-/.test(installed.integrity ?? '')) {
      fail('Missing registry integrity evidence for direct dependency ' + name);
    }
  }
}
console.log('Nested npm lock manifest has complete direct dependency and integrity entries. npm ci must still verify actual install.');
