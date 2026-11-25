// Test-only child process; receives only a temporary fixture database path and synthetic operation.
import {openWorkspace} from './workspace.mjs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [file,input,...extra]=process.argv.slice(2);assert.ok(file&&input&&!extra.length);
 const ws=openWorkspace(file,{now:()=>100});try{const result=ws.apply({actor:'editor',mfa:false},'alpha',JSON.parse(input));console.log(JSON.stringify({status:200,result}));}catch(error){if(error.status===409)console.log(JSON.stringify({status:409,error:error.message}));else throw error;}finally{ws.close();}
}
