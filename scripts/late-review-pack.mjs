import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,lstatSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,resolve,sep} from 'node:path';
const hash=s=>createHash('sha256').update(s).digest('hex');
const encode=x=>JSON.stringify(x,null,2)+'\n';
const moduleId=/^(1[5-9]|2[0-7])\.0[1-5]$/;
const lessonId=/^(1[5-9]|2[0-7])\.0[1-5]\.0[1-8]$/;
// Review-only files: never target src/content, live registries or checkpoint.
export function reviewPack(module,bindings,read,template){
 assert.match(module.id,moduleId);assert.equal(module.publicationApproved,false);assert.equal(module.qualification,'not-run');assert.equal(module.topics.length,8);
 assert.equal(template.moduleId,module.id);assert.equal(template.sourceSha256,module.fingerprint);assert.equal(template.publicationApproved,false);
 const topics=module.topics.filter(t=>!t.historical);assert.deepEqual(topics.map(t=>t.id).sort(),module.remaining.slice().sort(),'Module already/partially published');
 assert.deepEqual(template.lessons.map(t=>t.id).sort(),topics.map(t=>t.id).sort());
 const files=new Map(),manifest=[];
 for(const t of topics){assert.match(t.id,lessonId);assert.ok(t.id.startsWith(module.id+'.'));assert.equal(t.published,false);assert.match(t.path,/^drafts\/[a-z0-9-]+\/lessons\/\d{2}\.\d{2}\.\d{2}\.mdx$/);assert.ok(t.path.endsWith('/'+t.id+'.mdx'));
  const source=read(t.path);assert.equal(hash(source.replaceAll('\r\n','\n')),t.sha256,'Manuscript drift '+t.id);const path='lessons/'+t.id+'.mdx';assert.ok(!files.has(path));files.set(path,source);manifest.push({id:t.id,source:t.path,reviewPath:path,sha256:hash(source)});
 }
 for(const [path,digest] of Object.entries(bindings)){assert.match(path,/^(examples|drafts)\/[a-zA-Z0-9._/-]+$/);assert.ok(!path.split('/').some(s=>!s||s==='.'||s==='..'));assert.equal(hash(read(path)),digest,'Shared source drift '+path);}
 files.set('manifest.json',encode({moduleId:module.id,sourceFingerprint:module.fingerprint,topics:manifest,sharedBindings:bindings,runtimeObligations:module.runtime,sourceCommand:module.sourceScript,publicationApproved:false}));
 files.set('evidence.json',encode(template));files.set('README.md','# Unpublished review pack '+module.id+'\n\nOriginal manuscripts retained exactly. No live MDX, metadata, registry, checkpoint, or approval changes. Run the source command and actual runtime obligations listed in manifest.json from the complete source checkout. Retain sanitized evidence in artifacts/source.log and artifacts/<lesson-id>.log. Fill evidence.json only with actual observations and hashes. Source hashes are not proof of runtime success; human review and curriculum-order promotion remain separate.\n');return files;
}
export function exportReview(files){assert.ok(files instanceof Map&&files.size>0);const root=mkdtempSync(join(tmpdir(),'academy-late-review-'));try{for(const [path,source] of files){assert.match(path,/^(?:lessons\/\d{2}\.\d{2}\.\d{2}\.mdx|manifest\.json|evidence\.json|README\.md)$/);const target=join(root,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,source,{flag:'wx'});}mkdirSync(join(root,'artifacts'));return root;}catch(e){rmSync(root,{recursive:true,force:true});throw e;}}
export function verifyReviewArtifacts(module,evidence,readArtifact,validate){
 const structure=validate(module,evidence);assert.equal(structure.structureValid,true);assert.equal(structure.publicationApproved,false);
 const refs=[['source.log',evidence.sourceReceiptSha256],...evidence.lessons.map(t=>{assert.match(t.id,lessonId);return [t.id+'.log',t.runtimeArtifactSha256];})];
 for(const [path,digest] of refs){const bytes=readArtifact(path);assert.ok(Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=4*1024*1024,'Missing or oversized artifact '+path);assert.equal(hash(bytes),digest,'Artifact digest mismatch '+path);}
 return {...structure,artifactIntegrityVerified:true,artifacts:refs.length,authenticityVerified:false,publicationApproved:false};
}
export function readLocalArtifact(directory,name){assert.match(name,/^(?:source|\d{2}\.\d{2}\.\d{2})\.log$/);const root=realpathSync(resolve(directory)),path=join(root,name),info=lstatSync(path);assert.ok(info.isFile()&&!info.isSymbolicLink()&&info.size>0&&info.size<=4*1024*1024,'Invalid artifact file');assert.ok(realpathSync(path).startsWith(root+sep),'Artifact outside directory');return readFileSync(path);}
