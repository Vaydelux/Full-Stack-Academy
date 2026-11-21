/** Real ssr-hydration Query release acceptance. Runnable from candidate or live labs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url));
let root=here;
while(root!==path.dirname(root)&&
 (!fs.existsSync(path.join(root,'package.json'))||
  !fs.existsSync(path.join(root,'scripts','verify-query-release-browser.mjs'))))root=path.dirname(root);
if(!fs.existsSync(path.join(root,'scripts','verify-query-release-browser.mjs')))
 throw Error('Could not find the Full-Stack Academy repository root');
const sourceDir=path.join(root,'drafts','forms-query','labs','ssr-hydration');
test('09.03.06 ssr-hydration: exact lab bytes, instructor green and starter red in real Query browser/SSR',()=>{
 for(const variant of ['starter','solution']){
  assert.equal(
   fs.readFileSync(path.join(here,variant,'solution.tsx'),'utf8'),
   fs.readFileSync(path.join(sourceDir,variant+'.tsx'),'utf8'),
   'ssr-hydration '+variant+' differs from the browser-tested source');
 }
 for(const variant of ['starter','solution'])for(const name of ['providers.tsx','task-list.tsx']){
  assert.equal(
   fs.readFileSync(path.join(here,variant,name),'utf8'),
   fs.readFileSync(path.join(sourceDir,name),'utf8'),
   'SSR support file drift: '+variant+'/'+name);
 }
 const result=spawnSync(process.execPath,['scripts/verify-query-release-browser.mjs','--lab','ssr-hydration'],{
  cwd:root,env:process.env,encoding:'utf8',timeout:900000,maxBuffer:1024*1024
 });
 assert.ifError(result.error);
 assert.equal(result.status,0,result.stderr||result.stdout);
 assert.match(result.stdout,/"publicationGranted": false/);
});
