import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
import {readFile,cp,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const dir=fileURLToPath(new URL('./'+target+'/',import.meta.url));
const read=name=>readFile(join(dir,name),'utf8');
async function withProject(run){
  const temp=await mkdtemp(join(tmpdir(),'academy-toolchain-'));
  try { await cp(dir,temp,{recursive:true,filter:s=>!['node_modules','.git'].includes(s.split(/[\\/]/).at(-1))}); await run(temp); }
  finally { await rm(temp,{recursive:true,force:true}); }
}
function npmRun(cwd,args,extra={}){
  const env = {...process.env,...extra};
  // A nested node --test must not inherit the runner's internal context.
  delete env.NODE_TEST_CONTEXT;
  return spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{cwd,encoding:'utf8',timeout:30000,shell:process.platform==='win32',env});
}
async function verifyProject(...commands){
  await withProject(async cwd=>{for(const args of commands){const result=npmRun(cwd,args);assert.equal(result.status,0,result.stdout+'\n'+result.stderr);if(args.includes('test')||args.includes('verify'))assert.match(result.stdout,/\btests\s+[1-9]\d*/,'Nested tests must actually run');}});
}
test('manifest and lock match the intended runtime and package manager',async()=>{const p=JSON.parse(await read('package.json'));const l=JSON.parse(await read('package-lock.json'));assert.equal(p.private,true);assert.equal(p.type,'module');assert.equal(p.engines.node,'>=24 <25');assert.equal(p.scripts.test,'node --test');assert.equal(l.lockfileVersion,3);assert.equal(l.packages[''].name,p.name);assert.equal(l.packages[''].version,p.version);assert.deepEqual(l.packages[''].engines,p.engines);assert.deepEqual(Object.keys(l.packages),['']);});
test('clean npm install and test run in an isolated copy',async()=>{await verifyProject(['ci','--ignore-scripts','--no-audit','--no-fund'],['test']);});
