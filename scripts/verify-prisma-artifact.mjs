import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyPrismaLock} from './p4-prisma-lock.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
export const acceptedArtifact=Object.freeze({commit:'d6afc2cd3316139d3dda6af7d24d20a1f8f11b08',packageSha256:'43394d900913d10d59b2f04cc1e9c61a4dcfde506f3f57e0f5151e468421389b',lockSha256:'248b45136534894415fb501fcc0d9c2bcfb216ce48ccb26f6ec13e746835d0ee',packages:124,publicationApproved:false,runtimeQualified:false,registryInstallVerified:true});
export function verifyArtifact({source,manifest,lock,receipt}){
 assert.deepEqual(receipt,acceptedArtifact,'Unrecognized lock candidate receipt');
 assert.equal(hash(source),receipt.packageSha256,'Current package source differs');
 assert.deepEqual(manifest,source,'Artifact package differs');
 const verified=verifyPrismaLock(source,lock);
 for(const [key,value] of Object.entries(verified))assert.equal(receipt[key],value,'Artifact mismatch: '+key);
 return verified;
}
