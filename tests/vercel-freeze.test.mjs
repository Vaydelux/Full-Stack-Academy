import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Vercel source configuration disables automatic git deployment without changing framework/build commands',()=>{
 const cfg=JSON.parse(read('vercel.json'));
 assert.equal(cfg.git.deploymentEnabled,false);
 assert.deepEqual(Object.keys(cfg.git),['deploymentEnabled']);
 assert.equal(cfg.buildCommand,undefined);
 assert.equal(cfg.ignoreCommand,undefined);
});
test('manual GitHub workflow does not run on the merge push or pull requests',()=>{
 const workflow=read('.github/workflows/academy-quality.yml');
 assert.match(workflow,/workflow_dispatch:/);
 assert.doesNotMatch(workflow,/^\s+(push|pull_request):\s*$/m);
});
test('freeze check succeeds without Vercel credentials or contacting the platform',()=>{
 const command=spawnSync(process.execPath,['scripts/verify-vercel-freeze.mjs'],{encoding:'utf8',timeout:10000});
 assert.equal(command.status,0,command.stderr);
 assert.match(command.stdout,/freeze verified/);
});
