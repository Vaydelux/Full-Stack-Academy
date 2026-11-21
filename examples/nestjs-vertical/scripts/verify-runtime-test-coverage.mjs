/**
 * Deterministic SOURCE-ONLY guard for NestJS 12 curriculum runtime coverage.
 * Never reports runtime tests as executed and never publishes lesson content.
 * Requires no packages to be installed (Node built-ins only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(workspace, '../..');
const suites = {
  '11.01': 'architecture.test.mjs',
  '11.02': 'request-pipeline.test.mjs',
  '11.03': 'domain-modules.test.mjs',
  '11.04': 'advanced.test.mjs',
};
const integrations = {
  '11.03.06': 'postgres.integration.test.mjs',
  '11.04.03': 'websocket.integration.test.mjs',
};
const read = filename => fs.readFileSync(filename, 'utf8');
const local = name => path.join(workspace, name);
function report(issues, authored = 0) {
  return { kind: 'nestjs-source-test-coverage', authored,
    runtimeExecuted: false, integrationExecuted: false,
    readyToPublish: false, issues, valid: issues.length === 0 };
}

/** Validate semantic test mapping rather than merely counting test declarations. */
export function auditSuite(source, moduleId, expectedIds, slugForId) {
  const issues = [];
  const matches = [...source.matchAll(/^\s*test\(\s*['"](11\.\d{2}\.\d{2})\b/gm)];
  const ids = matches.map(match => match[1]);
  if (/\btest\.(?:skip|only|todo)\s*\(/.test(source)) {
    issues.push(moduleId + ': cannot count skipped, focused or TODO test cases');
  }
  if (ids.length !== expectedIds.length) {
    issues.push(moduleId + ': expected ' + expectedIds.length + ' topic-level tests, found ' + ids.length);
  }
  for (const id of expectedIds) {
    const index = ids.indexOf(id);
    if (index < 0) {
      issues.push(id + ': missing runtime topic test');
      continue;
    }
    if (ids.lastIndexOf(id) !== index) issues.push(id + ': duplicate runtime topic test');
    const start = matches[index].index;
    const end = matches[index + 1]?.index ?? source.length;
    const body = source.slice(start, end);
    const slug = slugForId[id];
    if (!slug) {
      issues.push(id + ': missing matching draft metadata labSlug');
      continue;
    }
    const redGreen = body.includes("redGreen('" + slug + "'") ||
      body.includes("checkBoth('" + slug + "'");
    const safeSkeleton = id === '11.04.08' &&
      body.includes("load('production-service-skeleton', 'solution')") &&
      body.includes('production-service-skeleton/starter.ts');
    if (!redGreen && !safeSkeleton) issues.push(id + ': test does not exercise canonical ' + slug + ' draft');
  }
  for (const id of ids) {
    if (!expectedIds.includes(id)) issues.push(id + ': unexpected or misassigned module test');
  }
  return issues;
}

export function inspectNestRuntimeCoverage() {
  const issues = [];
  let canonical, pkg;
  try {
    canonical = JSON.parse(read(path.join(root, 'data/curriculum.json')));
    pkg = JSON.parse(read(local('package.json')));
  } catch (error) {
    return report(['Cannot load curriculum and nested package manifests: ' + error.message]);
  }
  const ids = canonical.lessons.filter(item => Object.hasOwn(suites, item.moduleId));
  const slugForId = {};
  for (const lesson of ids) {
    try {
      const meta = JSON.parse(read(path.join(root, 'drafts/nestjs/lessons', lesson.id + '.meta.json')));
      const slug = meta.labSlug;
      if (!slug || !/^[a-z][a-z0-9-]+$/.test(slug)) throw Error('Invalid slug');
      slugForId[lesson.id] = slug;
      for (const name of ['starter.ts', 'solution.ts', 'lab.json']) {
        if (!fs.existsSync(path.join(root, 'drafts/nestjs/labs', slug, name))) {
          issues.push(lesson.id + ': missing ' + slug + '/' + name);
        }
      }
    } catch (error) { issues.push(lesson.id + ': ' + error.message); }
  }
  if (ids.length !== 32) issues.push('Canonical catalog must contain exactly 32 NestJS topics, found ' + ids.length);
  const allSuiteFiles = [];
  let authored = 0;
  for (const [moduleId, filename] of Object.entries(suites)) {
    const filepath = local('tests/' + filename);
    const expected = ids.filter(item => item.moduleId === moduleId).map(item => item.id);
    try {
      const source = read(filepath);
      authored += [...source.matchAll(/^\s*test\(\s*['\"]11\.\d{2}\.\d{2}\b/gm)].length;
      issues.push(...auditSuite(source, moduleId, expected, slugForId));
      allSuiteFiles.push(filepath);
    } catch (error) { issues.push(moduleId + ': cannot read test: ' + error.message); }
  }
  for (const [id, filename] of Object.entries(integrations)) {
    const filepath = local('tests/' + filename);
    try {
      const source = read(filepath);
      if (!source.includes("test('" + id + ' ')) issues.push(id + ': missing real integration declaration');
      if (/\btest\.(?:skip|only|todo)\s*\(/.test(source)) issues.push(id + ': integration is skipped, focused or TODO');
      if (id === '11.03.06' &&
          !['PG_TEST_URL', 'ACADEMY_ISOLATED_PG', 'CREATE TEMP TABLE', 'assert.rejects'].every(x => source.includes(x))) {
        issues.push(id + ': real PostgreSQL gate or rollback assertion is missing');
      }
      if (id === '11.04.03' &&
          !['socket.io-client', 'server.use(', 'aliceMessages', 'bobMessages', 'assert.rejects'].every(x => source.includes(x))) {
        issues.push(id + ': authenticated two-client Socket.IO gate is incomplete');
      }
      allSuiteFiles.push(filepath);
    } catch (error) { issues.push(id + ': cannot read integration: ' + error.message); }
  }
  const runtime = pkg.scripts?.['test:runtime'] ?? '';
  for (const filename of Object.values(suites)) {
    if (!runtime.includes('tests/' + filename)) issues.push('Runtime runner excludes ' + filename);
  }
  const release = pkg.scripts?.['qualify:release'] ?? '';
  if (!release.includes('npm run qualify') || !release.includes('npm run qualify:integration') ||
      !pkg.scripts?.['qualify:integration']?.includes('test:integration:pg') ||
      !pkg.scripts?.['qualify:integration']?.includes('test:integration:sockets')) {
    issues.push('Release runner does not require all runtime + live integration gates');
  }
  // Syntax validation is genuinely executed locally without resolving framework imports.
  for (const filepath of allSuiteFiles) {
    const checked = spawnSync(process.execPath, ['--check', filepath], { encoding: 'utf8' });
    if (checked.status !== 0) issues.push('JavaScript syntax error in ' + path.basename(filepath) + ': ' +
      (checked.stderr || checked.error?.message || 'unknown').slice(0, 300));
  }
  return report(issues, authored);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  if (args.some(a => !['--check', '--json'].includes(a))) {
    console.error('Usage: node scripts/verify-runtime-test-coverage.mjs [--check] [--json]');
    process.exitCode = 2;
  } else {
    const result = inspectNestRuntimeCoverage();
    if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
    else console.log('NestJS runtime source coverage: ' + result.authored + ' detected topic tests; 2 live-service source checks; ' +
      result.issues.length + ' source issues. Runtime qualification NOT EXECUTED.');
    if (result.issues.length) {
      console.error(result.issues.join('\n'));
      process.exitCode = 1;
    }
  }
}
