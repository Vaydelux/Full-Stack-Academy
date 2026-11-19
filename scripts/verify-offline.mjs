// Single-machine release-candidate quality gate.
// Runs only repository-owned local npm scripts. Does not contact Vercel or GitHub Actions.
import { spawnSync } from 'node:child_process';

const steps = [
  'lint',
  'typecheck',
  'test',
  'test:learning-dashboard',
  'test:study-plan',
  'test:lesson-discovery',
  'test:learning-workflow',
  'test:forms-query-http',
  'test:forms-query-workflow',
  'test:forms-query-contract',
  'validate',
  'verify:content',
  'checkpoint:check',
  'test:labs',
  'test:red-react',
  'test:react-red-advanced',
  'test:red-react-performance',
  'test:red-next-router',
  'test:red-next-full',
  'test:red-ui-track',
  'test:red-zod-foundations',
  'test:red-zustand-state',
  'test:node-http',
  'test:red-node-http',
  'test:backend-contract',
  'test:red-backend-contract',
  'build',
];

const major = Number.parseInt(process.versions.node.split('.')[0], 10);
if (major !== 24) {
  console.warn(`Recommended local toolchain is Node.js 24; detected ${process.version}. Verify compiler compatibility before release.`);
}

const isWindows = process.platform === 'win32';
for (const name of steps) {
  console.log(`\n=== OFFLINE QUALITY GATE: ${name} ===`);
  // Fixed script allowlist, no user-controlled shell parameters.
  const command = isWindows ? (process.env.ComSpec || 'cmd.exe') : 'npm';
  const args = isWindows ? ['/d', '/s', '/c', `npm run ${name}`] : ['run', name];
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) {
    console.error(`OFFLINE QUALITY GATE FAILED: ${name}`, result.error?.message ?? `exit ${result.status}`);
    process.exitCode = 1;
    break;
  }
}
if (!process.exitCode) {
  console.log('\nLocal scripted checks passed. This does NOT verify physical accessibility, browser interactions, or a hosted deployment.');
}
