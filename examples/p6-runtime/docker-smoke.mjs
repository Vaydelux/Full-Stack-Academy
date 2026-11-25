import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
assert.equal(process.env.ACADEMY_DOCKER_ISOLATED,'YES','Explicit local Docker opt-in required');
const image=process.env.ACADEMY_NODE_IMAGE??'';assert.match(image,/^node:24(?:\.[0-9]+){0,2}(?:-[a-z0-9-]+)?@sha256:[a-f0-9]{64}$/,'Supply an inspected local Node 24 digest');
const tag='academy-ops-'+randomUUID(),cwd=fileURLToPath(new URL('.',import.meta.url));
function run(args,{allowFailure=false,timeout=30000}={}){const p=spawnSync('docker',args,{cwd,encoding:'utf8',timeout,maxBuffer:1024*1024,windowsHide:true});if(!allowFailure)assert.ok(!p.error&&!p.signal&&p.status===0,'Docker command failed: '+args[0]);return p;}
const local=run(['image','inspect',image]);assert.ok(JSON.parse(local.stdout)[0].RepoDigests?.some(d=>d.endsWith('@'+image.split('@')[1])),'Local digest mismatch');
let built=false,started=false;
try{
 run(['build','--network','none','--pull=false','--build-arg','NODE_IMAGE='+image,'--tag',tag,'.'],{timeout:180000});built=true;
 run(['run','--detach','--name',tag,'--network','none','--read-only','--cap-drop','ALL','--security-opt','no-new-privileges','--memory','128m','--cpus','1','--pids-limit','64',tag]);started=true;
 const deadline=Date.now()+30000;let healthy=false;
 while(Date.now()<deadline){const inspect=JSON.parse(run(['inspect',tag]).stdout)[0];assert.equal(inspect.HostConfig.ReadonlyRootfs,true);assert.equal(inspect.HostConfig.NetworkMode,'none');assert.ok(inspect.HostConfig.CapDrop.includes('ALL'));assert.equal(inspect.Config.User,'10001:10001');if(inspect.State.Health?.Status==='healthy'){healthy=true;break;}assert.equal(inspect.State.Running,true);await delay(500);}
 assert.ok(healthy,'Container health did not pass');
 assert.equal(run(['exec',tag,'node','-p','process.getuid()']).stdout.trim(),'10001');
 run(['exec',tag,'node','-e',"Promise.all(['/health','/ready'].map(p=>fetch('http://127.0.0.1:8080'+p))).then(rs=>{if(rs.some(r=>r.status!==200))process.exitCode=1}).catch(()=>{process.exitCode=1})"]);
 console.log('Local Docker build, nonroot, read-only/network isolation and health smoke passed; publication NOT approved.');
}finally{if(started)run(['rm','-f',tag],{allowFailure:true});if(built)run(['image','rm',tag],{allowFailure:true});}
