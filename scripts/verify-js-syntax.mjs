/** Side-effect-free syntax gate for local release JavaScript.
 * node --check parses without executing code, installing packages or
 * generating browser/process activity. Run before expensive lint/build suites.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const targets=['scripts','tests','examples/p8-conditional-write','release-candidates/forms-query/09.02/labs',
 'release-candidates/forms-query/09.03/labs'];
const files=[];
function collect(relative){
 const absolute=path.join(root,relative);
 if(!fs.existsSync(absolute))return;
 for(const entry of fs.readdirSync(absolute,{withFileTypes:true})){
  const next=path.posix.join(relative,entry.name);
  if(entry.isDirectory())collect(next);
  else if(entry.isFile()&&entry.name.endsWith('.mjs'))files.push(next);
 }
}
for(const dir of targets)collect(dir);
files.sort();
if(files.length<20)throw new Error('Unexpectedly small release JS source gate: '+files.length);
const errors=[];
for(const file of files){
 const result=spawnSync(process.execPath,['--check',path.join(root,file)],{
  cwd:root,encoding:'utf8',timeout:15000,maxBuffer:1024*128,
 });
 if(result.error||result.status!==0)errors.push({
  file,message:(result.stderr??'').trim().slice(0,3000)||result.error?.message||'exit '+result.status
 });
}
console.log(JSON.stringify({
 checked:files.length,syntaxErrors:errors.length,
 includesCandidateBrowserTests:files.filter(f=>f.startsWith('release-candidates/')).length,
 runtimeTestsExecuted:false,sourceOnly:true,errors
},null,2));
if(errors.length)process.exitCode=1;
