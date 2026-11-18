// Each student starter is deliberately defective: confirm it fails a real assertion safely.
// This local-only check never uploads code or runs against a real user repository.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const readJson=(path)=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const lessons=readJson('data/curriculum.json').lessons.filter(x=>x.trackId==='05');
assert.equal(lessons.length,24,'Expected exactly 24 Git/Team/Monorepo topics');

for(const lesson of lessons){
 test('red student starter: '+lesson.id, {timeout:20000},()=>{
  const meta=readJson('src/content/lessons/'+lesson.id+'.meta.json');
  const slug=meta.labId.split('.').at(-1);
  const manifest=readJson('labs/'+slug+'/lab.json');
  const testPath=manifest.tests;
  const args=slug==='mono-contracts-capstone'
    ?['--import=tsx','--test',testPath]
    :['--test',testPath];
  const result=spawnSync(process.execPath,args,{
   cwd:root,
   env:{...process.env,ACADEMY_LAB_TARGET:'starter',GIT_TERMINAL_PROMPT:'0',GIT_ALLOW_PROTOCOL:'file'},
   encoding:'utf8',timeout:12000,maxBuffer:1024*1024,windowsHide:true
  });
  assert.equal(result.error,undefined,'Starter verifier failed to launch');
  assert.equal(result.signal,null,'Starter verifier must terminate normally');
  assert.notEqual(result.status,0,'A deliberately defective starter unexpectedly passed: '+lesson.id);
  const output=(result.stdout||'')+'\n'+(result.stderr||'');
  assert.match(output,/not ok|✖|fail\s+[1-9]/i,'The red outcome should come from a reported test failure');
  assert.doesNotMatch(output,/SyntaxError|ERR_MODULE_NOT_FOUND|Cannot find module/i,
   'A red starter must not be caused by broken test syntax or a missing module');
 });
}
