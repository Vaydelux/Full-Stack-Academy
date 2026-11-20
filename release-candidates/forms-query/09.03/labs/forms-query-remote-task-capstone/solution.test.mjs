import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
test('09.03.08 remote-task-capstone: solution passes and deliberately broken starter fails Query browser acceptance',()=>{
 const result=spawnSync(process.execPath,['scripts/verify-query-release-browser.mjs','--lab','remote-task-capstone'],{cwd:root,env:process.env,encoding:'utf8',timeout:600000});
 assert.equal(result.status,0,result.stderr||result.stdout);
});
