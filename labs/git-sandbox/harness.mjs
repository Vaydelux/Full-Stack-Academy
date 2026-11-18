// Teaching harness: every Git command runs only inside a newly created temporary local repository.
// Do not import or execute untrusted student scripts on a hosted server: Node test modules are local developer exercises.
import {spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {join,resolve,sep} from 'node:path';
import {tmpdir} from 'node:os';
export function createGitSandbox(){
 const root=mkdtempSync(join(tmpdir(),'academy-git-'));
 const cwd=join(root,'repo');mkdirSync(cwd);
 const env={...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:join(root,'empty-global'),GIT_ALLOW_PROTOCOL:'file',HOME:root};
 const git=(args,{allowFailure=false}={})=>{
  if(!Array.isArray(args)||args.some(x=>typeof x!=='string'||!x.trim()))throw new TypeError('Git arguments must be strings');
  if(args.some(x=>/^(-C|--git-dir|--work-tree|--exec-path|-c)$/.test(x)))throw new Error('Git root overrides are not permitted');
  const p=spawnSync('git',args,{cwd,env,encoding:'utf8',timeout:12000,maxBuffer:1024*1024,windowsHide:true});
  if(p.error)throw p.error;
  const result={stdout:p.stdout||'',stderr:p.stderr||'',status:p.status};
  if(p.status!==0&&!allowFailure)throw new Error('Local git command failed: git '+args.join(' ')+'\n'+result.stderr);
  return result;
 };
 const pathFor=path=>{if(typeof path!=='string'||path.startsWith('/')||path.includes('..'))throw new Error('Path traversal rejected');const target=resolve(cwd,path);if(target!==cwd&&!target.startsWith(cwd+sep))throw new Error('Outside sandbox');return target;};
 const write=(path,text)=>{const dest=pathFor(path);mkdirSync(dest.slice(0,dest.lastIndexOf(sep)),{recursive:true});writeFileSync(dest,text);};
 const read=path=>readFileSync(pathFor(path),'utf8');
 const exists=path=>existsSync(pathFor(path));
 const bareRemote=()=>{const path=join(root,'local-remote.git');const created=spawnSync('git',['init','--quiet','--bare',path],{cwd,env,encoding:'utf8',timeout:12000});if(created.status!==0)throw new Error(created.stderr);return path;};
 git(['init','--quiet','-b','main']);git(['config','user.name','Academy Test']);git(['config','user.email','academy@example.invalid']);git(['config','core.hooksPath',join(root,'no-hooks')]);
 const commitBase=()=>{write('README.md','# Offline training\n');git(['add','README.md']);git(['commit','--quiet','-m','chore: base']);};
 return {root,cwd,git,write,read,exists,bareRemote,commitBase,cleanup:()=>rmSync(root,{force:true,recursive:true})};
}
