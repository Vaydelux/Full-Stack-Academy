import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectLockManifest } from './lock-integrity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(root, 'package-lock.json');
function fail(message) {
  console.error('NestJS runtime is NOT qualified: ' + message);
  process.exit(2);
}
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor !== 24 || nodeMinor < 9) {
  fail('Release qualification requires Node.js 24.9+; detected ' + process.version);
}
if (!fs.existsSync(lockPath)) {
  fail('Generate a genuine npm registry-resolved package-lock.json; never invent integrity data.');
}
let pkg, lock;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
} catch (error) {
  fail('Cannot parse nested package or lock: ' + error.message);
}
const report = inspectLockManifest(pkg, lock);
if (!report.valid) fail(report.issues.join('; '));
console.log('Nested npm v3 lock manifest is structurally consistent; only npm ci can verify real integrity and runtime installation.');
