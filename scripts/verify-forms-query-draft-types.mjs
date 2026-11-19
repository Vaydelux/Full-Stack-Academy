/**
 * Syntax-only TypeScript/TSX quality gate.
 * A resolved TypeScript compiler is required, but RHF/Query packages are not.
 * This is NOT a typecheck or proof of browser/library correctness.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staging = path.join(root, 'drafts/forms-query/labs');
const reactClient = path.join(root, 'examples/forms-query-vertical/react-client');
const diagnostics = [];
const files = [];

function collect(dir, recursive = false) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) collect(absolute, true);
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      files.push(absolute);
    }
  }
}

collect(staging, true);
collect(path.join(reactClient, 'src'), true);
files.push(path.join(reactClient, 'vite.config.ts'));

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const scriptKind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.ES2022, true, scriptKind);
  const output = ts.transpileModule(code, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  });
  for (const diagnostic of [...ast.parseDiagnostics, ...(output.diagnostics ?? [])]) {
    if (diagnostic.category !== ts.DiagnosticCategory.Error) continue;
    const loc = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    diagnostics.push({
      file: path.relative(root, file).replaceAll(path.sep, '/'),
      line: loc ? loc.line + 1 : null,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
    });
  }
}

if (files.length < 40) diagnostics.push({
  file: 'drafts/forms-query/',
  line: null,
  message: 'Expected at least 34 staged TSX assets and six standalone React client TS/TSX files',
});
const result = {
  filesScanned: files.length,
  syntaxErrors: diagnostics.length,
  packageTypesResolved: false,
  browserTestsExecuted: false,
};
if (diagnostics.length) {
  console.error(JSON.stringify({ ...result, diagnostics }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    ...result,
    warning: 'Syntax-only gate passed. npm-installed library types, real TS typecheck, browser and SSR behavior remain separate requirements.',
  }, null, 2));
}
