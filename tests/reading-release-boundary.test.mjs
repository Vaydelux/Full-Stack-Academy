import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(join(root, file), 'utf8');

test('root TypeScript isolates staged P4 snippets and standalone Nest workspace but retains application code', t => {
  const config = JSON.parse(read('tsconfig.json'));
  const dir = mkdtempSync(join(tmpdir(), 'academy-compiler-boundary-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const included = ['src/app/learn/[lessonId]/page.tsx', 'src/components/course/ReadingEditionArticle.tsx', 'src/lib/academy/course-progress-server.ts', 'labs/typescript-example/solution.ts'];
  const excluded = ['drafts/p4/labs/authenticated-webhook-processing/starter.ts', 'drafts/p4/labs/batch-prisma-relations/solution.ts', 'examples/p8-nest-integrity/app.ts', 'examples/p8-nest-integrity/integration.test.ts'];
  for (const file of [...included, ...excluded]) {
    const target = join(dir, file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, 'export {};\n');
  }
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, dir);
  assert.deepEqual(parsed.errors, []);
  const files = new Set(parsed.fileNames.map(f => resolve(f)));
  for (const file of included) assert.ok(files.has(join(dir, file)), 'Website source excluded: ' + file);
  for (const file of excluded) assert.ok(!files.has(join(dir, file)), 'Separate fixture included: ' + file);
});

test('root lint scope isolates only staged P4 lab snippets and standalone Nest workspace', () => {
  const lint = read('eslint.config.mjs');
  assert.match(lint, /"drafts\/p4\/labs\/\*\*"/);
  assert.match(lint, /"examples\/p8-nest-integrity\/\*\*"/);
  assert.doesNotMatch(lint, /"src\/\*\*"|"labs\/\*\*"|"scripts\/\*\*"|"tests\/\*\*"/);
});

test('reading route and renderer resolve repository-owned helpers with TypeScript declarations', () => {
  const config = JSON.parse(read('tsconfig.json'));
  const options = ts.convertCompilerOptionsFromJson(config.compilerOptions, root).options;
  options.baseUrl = root;
  const files = ['src/app/learn/[lessonId]/page.tsx', 'src/components/course/ReadingEditionArticle.tsx', 'src/lib/academy/course-progress-server.ts', 'src/app/search/page.tsx', 'src/components/course/DocShell.tsx', 'src/components/course/CurriculumContinuation.tsx', 'src/lib/academy/store.ts', 'src/lib/academy/site.ts', 'src/components/workspace/PreviewPane.tsx'];
  let checked = 0;
  for (const file of files) {
    for (const match of read(file).matchAll(/from ['"]((?:\.{1,2}\/|@\/)[^'"]+\.mjs)['"]/g)) {
      const resolved = ts.resolveModuleName(match[1], join(root, file), options, ts.sys).resolvedModule;
      assert.ok(resolved, `${file}: unresolved ${match[1]}`);
      assert.ok(resolved.resolvedFileName.endsWith('.d.mts'), `${file}: missing declarations ${match[1]}`);
      checked++;
    }
  }
  assert.ok(checked >= 13, 'Missing expected repository helper imports: '+checked);
});
