import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../',import.meta.url));
function fixture(t,{childCode=0,prepareFailure=false,closeFailure=false}={}){
 const root=mkdtempSync(path.join(tmpdir(),'academy-browser-exit-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(path.join(root,'scripts'));mkdirSync(path.join(root,'node_modules','next'),{recursive:true});
 for(const file of ['verify-academy-browser.mjs','bounded-child.mjs'])copyFileSync(path.join(repo,'scripts',file),path.join(root,'scripts',file));
 writeFileSync(path.join(root,'scripts','f17-ux-browser-smoke.mjs'),'process.exit('+childCode+');');
 // A realistic failure boundary: a framework installs a global handler that logs,
 // but does not propagate an uncaught top-level rejection as a nonzero exit.
 writeFileSync(path.join(root,'node_modules','next','index.js'),`
 const fs=require('node:fs');
 module.exports=()=>({
  async prepare(){process.on('uncaughtException',e=>console.error('Framework caught:',e.message));if(${prepareFailure})throw Error('prepare fixture failed');},
  getRequestHandler(){return (req,res)=>res.end('fixture');},
  async close(){fs.writeFileSync(${JSON.stringify(path.join(root,'closed'))},'yes');if(${closeFailure})throw Error('close fixture failed');}
 });
 `);
 const result=spawnSync(process.execPath,[path.join(root,'scripts','verify-academy-browser.mjs'),'--responsive'],{cwd:root,encoding:'utf8',timeout:10000,windowsHide:true});
 assert.equal(result.error,undefined);
 assert.equal(readFileSync(path.join(root,'closed'),'utf8'),'yes','app cleanup must execute');
 return result;
}
test('successful child and cleanup exit zero',t=>{assert.equal(fixture(t).status,0);});
test('child failure remains nonzero even with a framework uncaught handler',t=>{
 const result=fixture(t,{childCode:7});assert.equal(result.status,1);assert.match(result.stderr,/Browser qualification failed:.*Child failed: 7/s);
});
test('application preparation failure exits nonzero and closes app',t=>{
 const result=fixture(t,{prepareFailure:true});assert.equal(result.status,1);assert.match(result.stderr,/prepare fixture failed/);
});
test('cleanup failure also exits nonzero',t=>{
 const result=fixture(t,{closeFailure:true});assert.equal(result.status,1);assert.match(result.stderr,/close fixture failed/);
});
