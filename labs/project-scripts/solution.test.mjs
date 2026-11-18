import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
import {readFile,writeFile,cp,mkdtemp,rm} from 'node:fs/promises';
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
test('verification runs independent checks and fails fast',async()=>{const p=JSON.parse(await read('package.json'));assert.deepEqual(p.scripts,{check:'node --check app.mjs',test:'node --test',verify:'npm run check && npm test'});await verifyProject(['ci','--ignore-scripts','--no-audit','--no-fund'],['run','verify']);});
test('a broken module causes a failed verification exit',async()=>{await withProject(async dir=>{await writeFile(join(dir,'app.mjs'),'export function total(){return 99;}\n');const result=npmRun(dir,['run','verify']);assert.equal(result.status,1,result.stdout+'\n'+result.stderr);assert.match(result.stdout,/\bfailed|not ok|✖/i,'A failing assertion must be reported');});});
