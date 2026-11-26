/** Cross-platform Python 3 launcher for the package integrity validator. */
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';

const defaultRoot=fileURLToPath(new URL('../',import.meta.url));
export function runPackageValidation({spawn=spawnSync,platform=process.platform,root=defaultRoot}={}){
 const candidates=platform==='win32'?[['py',['-3']],['python',[]],['python3',[]]]:[['python3',[]],['python',[]]];
 for(const [command,prefix] of candidates){
  const probe=spawn(command,[...prefix,'-I','-c','import sys; raise SystemExit(0 if sys.version_info.major == 3 and sys.flags.optimize == 0 else 1)'],{cwd:root,stdio:'ignore',shell:false,windowsHide:true,timeout:10000});
  if(probe.error||probe.signal||probe.status!==0)continue;
  // Do not fall back to another interpreter after a real validation failure.
  // Isolated mode ignores PYTHONOPTIMIZE, keeping the validator's asserts enabled.
  const result=spawn(command,[...prefix,'-I',path.join(root,'validate_package.py')],{cwd:root,stdio:'inherit',shell:false,windowsHide:true,timeout:120000});
  if(result.error||result.signal||result.status!==0)throw new Error('Package validation failed: '+(result.error?.message??result.signal??result.status));
  return;
 }
 throw new Error('Python 3 is required for package validation; install Python 3 or make it available on PATH.');
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 try{runPackageValidation();}catch(error){console.error(error.message);process.exitCode=1;}
}
