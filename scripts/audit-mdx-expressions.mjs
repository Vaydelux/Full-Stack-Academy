import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
export function findExpressions(tree){
 const findings=[];
 function visit(node){
  if(['mdxTextExpression','mdxFlowExpression'].includes(node.type)) findings.push({line:node.position?.start.line??null,expression:node.value});
  for(const child of node.children??[]) visit(child);
 }
 visit(tree);
 return findings;
}
export async function audit(root,compile){
 const files=[];
 function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   const target=path.join(dir,entry.name);
   if(entry.isDirectory()) walk(target);
   else if(entry.isFile()&&entry.name.endsWith('.mdx')) files.push(target);
  }
 }
 for(const dir of ['src/content/lessons','drafts/forms-query/lessons']) walk(path.join(root,dir));
 if(!files.length) throw new Error('Empty executable lesson inventory');
 const findings=[];
 for(const file of files.sort()){
  const relative=path.relative(root,file);
  try{
   await compile(fs.readFileSync(file,'utf8'),{remarkPlugins:[()=>tree=>{for(const finding of findExpressions(tree)) findings.push({file:relative,...finding});}]});
  }catch(error){findings.push({file:relative,error:String(error)});}
 }
 return {filesScanned:files.length,findings};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const require=createRequire(import.meta.url);
 const loaderRequire=createRequire(require.resolve('@mdx-js/loader'));
 const {compile}=await import(pathToFileURL(loaderRequire.resolve('@mdx-js/mdx')).href);
 const result=await audit(fileURLToPath(new URL('../',import.meta.url)),compile);
 console.log(JSON.stringify(result,null,2));
 if(result.findings.length) process.exitCode=1;
}
