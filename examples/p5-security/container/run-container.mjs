import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const composeFile=fileURLToPath(new URL('./compose.yaml',import.meta.url));
const scriptFile=fileURLToPath(import.meta.url);
const projectPattern=/^academy-p5-[a-f0-9]{8}$/;

// Each run owns its uniquely named Docker Compose resources. Never call docker
// system prune, delete arbitrary volumes, or inspect the host's other projects.
export function runContainerQualification({spawn=spawnSync,project='academy-p5-'+randomBytes(4).toString('hex')}={}){
 if(!projectPattern.test(project))throw Error('Invalid isolated project identifier');
 const common=['compose','-f',composeFile,'-p',project];
 console.log('Starting disposable P5 qualification project: '+project);
 let code=1;
 try {
  const outcome=spawn('docker',[...common,'up','--build','--abort-on-container-exit','--exit-code-from','qualifier'],{stdio:'inherit',timeout:900000});
  if(outcome.error){console.error('BLOCKED: Docker Compose unavailable: '+outcome.error.message);code=2;}
  else code=outcome.status===0?0:1;
 }catch(error){console.error('BLOCKED: Docker Compose failed: '+error.message);code=2;}
 finally {
  try{
   const down=spawn('docker',[...common,'down','--volumes','--remove-orphans'],{stdio:'inherit',timeout:120000});
   if(down.error||down.status!==0){console.error('WARNING: isolated project cleanup not confirmed; inspect only project '+project);if(code===0)code=1;}
  }catch(error){console.error('WARNING: isolated project cleanup failed: '+error.message);if(code===0)code=1;}
 }
 return code;
}
if(process.argv[1]&&resolve(process.argv[1])===scriptFile)process.exitCode=runContainerQualification();
