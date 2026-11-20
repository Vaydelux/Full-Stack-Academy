import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Declaration generation and public types — package and compiler contract",async()=>{assert.equal(solve({x:2,y:3}),5);assert.equal(solve({x:0,y:0}),0);});
test('real TypeScript compiler emits public .d.ts', async () => {
  const ts = await import('typescript');
  const file = fileURLToPath(new URL('./solution/solution.ts', import.meta.url));
  const emitted = new Map();
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    declaration: true,
    emitDeclarationOnly: true,
    skipLibCheck: true,
    strict: true,
  };
  const host = ts.createCompilerHost(options);
  host.writeFile = (name, data) => emitted.set(name, data);
  const program = ts.createProgram([file], options, host);
  const result = program.emit();
  assert.equal(result.emitSkipped, false, 'Declaration build should not be skipped');
  assert.ok([...emitted.values()].some(text => text.includes('interface PublicPoint') && text.includes('declare function solve')),
    'Expected exported public declaration');
});
