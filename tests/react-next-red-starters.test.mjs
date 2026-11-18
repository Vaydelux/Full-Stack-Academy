// Deterministic negative gate for 79 intentionally defective student starters.
// Does not run remote code: fixtures are maintained source in this repository.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lessons=json('data/curriculum.json').lessons.filter(x=>(x.trackId==='06'||x.trackId==='07')&&x.id!=='06.01.01');
assert.equal(lessons.length,79);
for(const lesson of lessons){
 test('starter fails meaningful contract: '+lesson.id,{timeout:30000},()=>{
  const meta=json('src/content/lessons/'+lesson.id+'.meta.json');
  const lab=json('labs/'+meta.labId.split('.').at(-1)+'/lab.json');
  const env={...process.env,ACADEMY_LAB_TARGET:'starter',GIT_TERMINAL_PROMPT:'0'};
  delete env.NODE_TEST_CONTEXT;
  const result=spawnSync(process.execPath,['--import=tsx','--test',lab.tests],{cwd:root,env,encoding:'utf8',timeout:20000,maxBuffer:1024*1024,windowsHide:true});
  assert.equal(result.error,undefined,'No test runner startup failure: '+lesson.id);
  assert.equal(result.signal,null,'Starter must exit normally: '+lesson.id);
  assert.notEqual(result.status,0,'Starter unexpectedly passed: '+lesson.id);
  const output=(result.stdout||'')+'\n'+(result.stderr||'');
  assert.match(output,/not ok|✖|fail\s+[1-9]/i,'Expected a real assertion failure: '+lesson.id);
  assert.doesNotMatch(output,/SyntaxError|ERR_MODULE_NOT_FOUND|Cannot find module/i,'Red starter must not be caused by broken syntax/module loading: '+lesson.id);
 });
}
