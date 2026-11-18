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
test('runtime, lock and safe project contract are present',async()=>{const p=JSON.parse(await read('package.json'));const l=JSON.parse(await read('package-lock.json'));assert.equal((await read('.node-version')).trim(),'24');assert.equal(p.engines.node,'>=24 <25');assert.equal(l.packages[''].name,p.name);assert.deepEqual(l.packages[''].engines,p.engines);assert.equal(p.scripts.verify,'npm run check && npm test');assert.equal(p.scripts.start,'node --env-file=.env.example app.mjs');assert.match(await read('.gitignore'),/!\.env\.example/);assert.match(await read('README.md'),/npm ci/);assert.match(await read('README.md'),/npm run verify/);});
test('clean copy installs, verifies and starts without account or cloud secrets',async()=>{await withProject(async dir=>{for(const args of [['ci','--ignore-scripts','--no-audit','--no-fund'],['run','verify'],['start']]){const result=npmRun(dir,args,{PORT:'3100',APP_MODE:'development'});assert.equal(result.status,0,result.stdout+'\n'+result.stderr);if(args.includes('verify'))assert.match(result.stdout,/\btests\s+[1-9]\d*/,'Nested tests must actually run');if(args[0]==='start')assert.match(result.stdout,/Ready on 3100 \(development\)/);}});});
