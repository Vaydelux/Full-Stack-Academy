import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyPrismaLock} from './p4-prisma-lock.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
export const acceptedArtifact=Object.freeze({commit:'d5372f297cd84ed3fc14354d0f2156322dcc540e',packageSha256:'bf9bb8fe1e865f1257217350c67e8e502c333d04346de4ba27e6a09de7912f54',lockSha256:'6224c119f414d23df5ad20ccfe69df33b60022ba331006408e6b36eb4177ee7c',packages:156,publicationApproved:false,runtimeQualified:false,registryInstallVerified:false});
export const expectedRuntime=Object.freeze({commit:acceptedArtifact.commit,lockSha256:acceptedArtifact.lockSha256,runtimeQualified:true,scope:'supplemental-prisma-runtime',topicQualification:false,publicationApproved:false});
export function verifyArtifact({source,manifest,lock,receipt,log}){
 assert.deepEqual(receipt,acceptedArtifact,'Unrecognized lock candidate receipt');
 assert.equal(hash(source),receipt.packageSha256,'Current package source differs');
 assert.deepEqual(manifest,source,'Artifact package differs');
 const verified=verifyPrismaLock(source,lock);
 for(const [key,value] of Object.entries(verified))assert.equal(receipt[key],value,'Artifact mismatch: '+key);
 const lines=log.split(/\r?\n/);
 assert.equal(lines.filter(l=>l==='found 0 vulnerabilities').length,1,'Missing exact audit success');
 assert.equal(lines.filter(l=>l==='Prisma integration: real generated client/migration/CRUD test passed; module publication NOT approved.').length,1,'Missing exact Prisma integration success');
 const runtime=lines.filter(l=>l.startsWith('{"commit":')&&l.includes('"runtimeQualified":'));
 assert.equal(runtime.length,1,'Missing or ambiguous runtime receipt');
 assert.deepEqual(JSON.parse(runtime[0]),expectedRuntime);
 return {...verified,runtimeQualified:true,topicQualification:false};
}
