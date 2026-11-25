/** Fixed module-specific runtime plans; a successful run is not publication approval. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';

const modules = Object.freeze({
  '11.01': ['test:architecture'],
  '11.02': ['test:pipeline'],
  '11.03': ['test:domain', 'test:integration:pg'],
  '11.04': ['test:advanced', 'test:integration:sockets'],
});
export function modulePlan(id) {
  assert.ok(Object.hasOwn(modules,id), 'Unknown NestJS module: '+id);
  return ['test:source-coverage', 'require-lock', 'install', 'typecheck', 'build', ...modules[id]];
}
export function qualifyModule(id, execute) {
  const steps=modulePlan(id), results=[];
  for(const step of steps){
    const result=execute(step);
    const passed=result?.status===0&&!result.error&&!result.signal;
    results.push({step,passed});
    if(!passed)return {moduleId:id,status:'failed',results,publicationApproved:false};
  }
  return {moduleId:id,status:'runtime-passed',results,publicationApproved:false};
}
const self=fileURLToPath(import.meta.url);
if(process.argv[1]&&resolve(process.argv[1])===self){
  const [mode,id,...extra]=process.argv.slice(2);
  assert.ok(!extra.length&&['--plan','--run'].includes(mode),'Usage: npm run qualify:module -- --plan|--run 11.01');
  const steps=modulePlan(id);
  if(mode==='--plan')console.log(JSON.stringify({moduleId:id,steps,status:'not-run',publicationApproved:false},null,2));
  else {
    const root=resolve(dirname(self),'..');
    assert.ok(/^v24\.(?:[9]|[1-9]\d+)\.\d+$/.test(process.version),'Node 24.9+ stable required');
    const npm=process.env.npm_execpath;
    assert.ok(typeof npm==='string'&&isAbsolute(npm)&&basename(npm)==='npm-cli.js'&&existsSync(npm),'Invoke via npm run');
    const report=qualifyModule(id,step=>{
      const args=step==='require-lock'?['scripts/require-lock.mjs']:
        step==='install'?[npm,'ci']:[npm,'run',step];
      return spawnSync(process.execPath,args,{cwd:root,stdio:'inherit',timeout:1_800_000,windowsHide:true});
    });
    console.log(JSON.stringify(report,null,2));
    if(report.status!=='runtime-passed')process.exitCode=1;
  }
}
