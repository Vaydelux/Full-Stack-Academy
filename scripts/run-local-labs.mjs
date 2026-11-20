// Cross-platform, manifest-driven offline lab test runner.
// Run only checked-in, explicitly named test files, in small process batches.
// Avoid Windows cmd.exe's 8191-character command-line limit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const labsRoot=path.join(root,'labs');
const files=[];
const browserFiles=[];
const seen=new Set();
for(const entry of fs.readdirSync(labsRoot,{withFileTypes:true}).filter(x=>x.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))){
 const manifestPath=path.join(labsRoot,entry.name,'lab.json');
 if(!fs.existsSync(manifestPath))continue;
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 const testFile=manifest.tests;
 if(typeof testFile!=='string'||!/^labs\/[a-z0-9-]+\/solution\.test\.(mjs|tsx)$/.test(testFile)){
  throw new Error('Untrusted or unsupported local lab test path: '+String(testFile));
 }
 const resolved=path.resolve(root,testFile);
 if(!resolved.startsWith(root+path.sep)||!fs.statSync(resolved).isFile())throw new Error('Missing or outside-root lab test: '+testFile);
 if(seen.has(resolved))throw new Error('Duplicate lab acceptance file: '+testFile);
 seen.add(resolved);
 // Real-browser labs must not start dozens of Chromium processes in one test batch.
 if(typeof manifest.runtime==='string'&&manifest.runtime.includes('browser'))browserFiles.push(testFile);
 else files.push(testFile);
}
if(!files.length&&!browserFiles.length)throw new Error('No local labs discovered');

const batchSize=20;
for(let i=0;i<files.length;i+=batchSize){
 const batch=files.slice(i,i+batchSize);
 console.log('\n=== Local labs '+(i+1)+'–'+(i+batch.length)+' of '+files.length+' ===');
 // No shell: Node receives an argv array, preventing Windows shell length problems.
 const result=spawnSync(process.execPath,['--import','tsx','--test',...batch],{
  cwd:root,env:process.env,stdio:'inherit',timeout:180000,
 });
 if(result.error||result.status!==0){
  console.error('Lab batch failed:',result.error?.message??'exit '+result.status);
  process.exitCode=1;
  break;
 }
}

if(!process.exitCode){
 for(const file of browserFiles){
  console.log('\n=== Browser-backed local lab: '+file+' ===');
  const result=spawnSync(process.execPath,['--import','tsx','--test',file],{
   cwd:root,env:process.env,stdio:'inherit',timeout:180000,
  });
  if(result.error||result.status!==0){
   console.error('Browser-backed lab failed:',result.error?.message??'exit '+result.status);
   process.exitCode=1;
   break;
  }
 }
}
if(!process.exitCode)console.log('All '+(files.length+browserFiles.length)+' instructor lab test files completed successfully.');

