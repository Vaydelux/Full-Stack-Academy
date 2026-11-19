// Syntax-only gate: TypeScript diagnostic parser, not full type resolution.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const staging=path.join(root,'drafts/forms-query/labs');
const problems=[];
let scanned=0;
for(const entry of fs.readdirSync(staging,{withFileTypes:true}).filter(item=>item.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))){
 const folder=path.join(staging,entry.name);
 for(const name of fs.readdirSync(folder).filter(name=>name.endsWith('.tsx')).sort()){
  const file=path.join(folder,name);
  const body=fs.readFileSync(file,'utf8');
  const output=ts.transpileModule(body,{fileName:file,reportDiagnostics:true,compilerOptions:{
   jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,
  }});
  const errors=(output.diagnostics??[]).filter(item=>item.category===ts.DiagnosticCategory.Error);
  for(const error of errors){
   const loc=error.file?.getLineAndCharacterOfPosition(error.start??0);
   problems.push({file:path.relative(root,file),line:loc?loc.line+1:null,message:ts.flattenDiagnosticMessageText(error.messageText,' ')});
  }
  scanned++;
 }
}
if(problems.length){
 console.error(JSON.stringify({scanned,problems},null,2));process.exitCode=1;
}else console.log(JSON.stringify({scanned,syntaxDiagnostics:0,warning:'TypeScript transpilation checks syntax only. Typecheck, runtime and UI tests are NOT established.'},null,2));
