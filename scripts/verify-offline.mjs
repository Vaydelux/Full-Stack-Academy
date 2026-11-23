// Single-machine release-candidate quality gate.
// Runs only repository-owned local npm scripts. Does not contact Vercel or GitHub Actions.
import { spawnSync } from 'node:child_process';
import { requireReleaseNodeRuntime } from './release-runtime.mjs';

const steps = [
  'test:js-syntax',
  'test:vercel-freeze',
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
  'test:forms-query-project-route',
  'test:forms-query-drafts',
  'test:forms-query-draft-types',
  'test:forms-query-react-api',
  'test:forms-query-policy',
  'test:forms-query-react-wiring',
  'test:forms-query-native-ui',
  'test:forms-query-browser-navigation',
  'test:forms-query-promotion',
  'test:forms-query-rhf-editorial',
  'test:forms-query-draft-preview',
  'test:forms-query-p1-content',
  'test:forms-query-p1-report',
  'test:nestjs-drafts',
  'test:forms-query-rhf-browser-gate',
  'test:forms-query-query-browser-gate',
  'test:forms-query-rhf-candidates',
  'test:forms-query-query-candidates',
  'test:forms-query-query-release-article',
  'test:forms-query-query-promotion',
  'test:forms-query-projection-integrity',
  'test:forms-query-dependency-boundary',
  'test:forms-query-lab-runner',
  'test:forms-query-promotion-command',
  'test:forms-query-promotion-rehearsal',
  'test:forms-query-published-article',
  'test:forms-query-review-fingerprint',
  'test:curriculum-readiness',
  'test:publication-phases',
  'test:course-roadmap',
  'test:p4-source',
  'test:release-runtime',
  'test:postgresql-modeling-source',
  'test:postgresql-p3-source',
  'test:postgresql-drafts',
  'validate',
  'verify:content',
  'checkpoint:check',
  'test:labs',
  'test:red-starters',
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

// The release gate must not report a successful build on an unqualified Node version.
// Individual source-only unit tests can still run on other Node versions.
try {
  requireReleaseNodeRuntime(process.version);
} catch (error) {
  console.error('OFFLINE QUALITY GATE BLOCKED:', error.message);
  process.exit(1);
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
