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
test('ignore rules are exact and retain example configuration',async()=>{assert.deepEqual((await read('.gitignore')).trim().split(/\r?\n/),['.env','.env.*','!.env.example','node_modules/']);});
test('real local git commit and secret ignore behavior',async()=>{await withProject(async dir=>{const git=(...args)=>{const r=spawnSync('git',args,{cwd:dir,encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'Academy Learner',GIT_AUTHOR_EMAIL:'learner@example.invalid',GIT_COMMITTER_NAME:'Academy Learner',GIT_COMMITTER_EMAIL:'learner@example.invalid'},timeout:15000});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};git('init','-q');git('config','--local','user.name','Academy Learner');git('config','--local','user.email','learner@example.invalid');await writeFile(join(dir,'.env.local'),'SYNTHETIC_ONLY=1');git('check-ignore','.env.local');git('add','README.md','.gitignore');git('-c','commit.gpgsign=false','-c','core.hooksPath='+join(dir,'no-hooks'),'commit','-qm','Initialize local lab');assert.equal(git('log','-1','--format=%ae'),'learner@example.invalid');assert.doesNotMatch(git('ls-files'),/\.env\.local/);});});
