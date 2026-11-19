// Local-only syntax and content gate for the 80-topic React 19 / Next.js 16 program.
// No Vercel, GitHub Actions, browser launch, package fetch, or network calls.
// This gate compiles MDX syntax and parses TSX; it does not typecheck or execute the samples.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {compile} from '@mdx-js/mdx';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const lessons=json('data/curriculum.json').lessons.filter(x=>['06','07'].includes(x.trackId));
assert.equal(lessons.length,80,'The canonical React/Next program has 80 topics');

let mdxChecked=0,tsSourcesChecked=0;
const errors=[];
for(const lesson of lessons){
 const id=lesson.id;
 const mdxPath='src/content/lessons/'+id+'.mdx';
 try{
  await compile(read(mdxPath),{development:false,outputFormat:'program'});
  mdxChecked++;
 }catch(error){errors.push(mdxPath+': '+String(error));continue;}
 if(id==='06.01.01')continue;
 const meta=json('src/content/lessons/'+id+'.meta.json');
 const slug=meta.labId.split('.').at(-1),base='labs/'+slug;
 const paths=[base+'/starter/solution.ts',base+'/solution/solution.ts'];
 if(lesson.trackId==='06')paths.push(base+'/starter/Widget.tsx',base+'/solution/Widget.tsx');
 else paths.push(base+'/example.tsx');
 for(const p of paths){
  const source=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  tsSourcesChecked++;
  for(const diagnostic of source.parseDiagnostics??[]){
   const position=source.getLineAndCharacterOfPosition(diagnostic.start??0);
   errors.push(p+':'+(position.line+1)+':'+(position.character+1)+': '+ts.flattenDiagnosticMessageText(diagnostic.messageText,'\n'));
  }
 }
}
assert.deepEqual(errors,[], 'MDX/TSX parser errors:\n'+errors.join('\n'));
assert.equal(mdxChecked,80);
assert.equal(tsSourcesChecked,79*3+39);
console.log(JSON.stringify({status:'source-syntax-passed',mdxChecked,tsSourcesChecked,
 limitations:['TypeScript type safety needs npm run typecheck','React hydrated behavior needs interaction/browser tests','Next.js App Router/cache examples need isolated application tests']},null,2));
