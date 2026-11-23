import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {stages} from './evidence.mjs';

const shaPattern=/^[a-f0-9]{40}$/;
const logPattern=/^[a-f0-9]{64}$/;
export function parseEvidenceLog(log){
 if(typeof log!=='string'||log.length>16*1024*1024)throw Error('Invalid evidence log');
 const match=[...log.matchAll(/P5_QUALIFICATION_EVIDENCE=([a-zA-Z0-9_-]+)/g)];
 if(match.length!==1)throw Error('Expected exactly one qualification evidence record');
 let result;
 try{result=JSON.parse(Buffer.from(match[0][1],'base64url').toString('utf8'));}
 catch{throw Error('Malformed qualification evidence')}
 return result;
}
export function validateEvidence(report,expectedCommit,{now=Date.now(),maxAgeMs=86400000}={}){
 const errors=[];
 if(!report||typeof report!=='object'||Array.isArray(report))return ['Missing evidence object'];
 if(report.schemaVersion!==1)errors.push('Unknown evidence format');
 if(report.passed!==true)errors.push('Qualification is not marked passed');
 if(!shaPattern.test(expectedCommit)||report.commit!==expectedCommit)errors.push('Commit SHA mismatch');
 if(!/^v24\.\d+\.\d+/.test(report.nodeVersion||''))errors.push('Node 24 evidence absent');
 if(!Number.isInteger(report.postgresServerVersion)||report.postgresServerVersion<170000)errors.push('PostgreSQL 17+ evidence absent');
 if(report.databaseType!=='disposable-local-postgresql')errors.push('Wrong database qualification target');
 const when=Date.parse(report.completedAt);
 if(!Number.isFinite(when)||when>now+60000||now-when>maxAgeMs)errors.push('Evidence is stale, absent or from the future');
 if(!Array.isArray(report.stages)||report.stages.length!==stages.length)errors.push('Missing required qualification stages');
 else for(let i=0;i<stages.length;i++){
  const got=report.stages[i],expected=stages[i];
  if(!got||got.name!==expected.command||got.passed!==true||got.exitCode!==0||got.requiredMarker!==expected.marker||got.markerPresent!==true||!logPattern.test(got.logSha256||''))
   errors.push('Qualification stage '+expected.command+' is missing or failed');
 }
 return errors;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [logPath,expectedCommit]=process.argv.slice(2);
 if(!logPath||!shaPattern.test(expectedCommit||'')){
  console.error('Usage: node verify-evidence.mjs <captured-compose-log> <40-character-git-SHA>');process.exitCode=2;
 }else try{
  const report=parseEvidenceLog(readFileSync(logPath,'utf8'));
  const errors=validateEvidence(report,expectedCommit);
  if(errors.length){console.error('NOT QUALIFIED: '+errors.join('; '));process.exitCode=1;}
  else console.log('P5 qualification evidence verified for '+expectedCommit+' (synthetic lab only)');
 }catch(error){console.error('NOT QUALIFIED: '+error.message);process.exitCode=1;}
}
