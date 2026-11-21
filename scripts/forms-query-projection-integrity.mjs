/** Deterministic, module-independent expected publication tree digest.
 * This is an integrity check, NOT accessibility, reviewer or runtime evidence.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

export function projectionFingerprint(files){
 if(!(files instanceof Map)||files.size===0)throw Error('Publication projection must be a nonempty Map');
 const digest=createHash('sha256');
 for(const [rel,contents] of [...files].sort(([a],[b])=>a<b?-1:a>b?1:0)){
  if(typeof rel!=='string'||!/^[A-Za-z0-9._/-]+$/.test(rel)||
    rel.startsWith('/')||rel.includes('\\')||/(^|\/)\.{1,2}(\/|$)/.test(rel)){
   throw Error('Invalid publication target path: '+String(rel));
  }
  if(typeof contents!=='string')throw Error('Non-text publication source: '+rel);
  digest.update(rel+'\0');
  digest.update(contents,'utf8');
  digest.update('\0');
 }
 return {files:files.size,sha256:digest.digest('hex')};
}

export function verifyProjectionOnDisk(files,readActual){
 if(typeof readActual!=='function')throw Error('Missing publication file reader');
 const expected=projectionFingerprint(files);
 const actual=new Map();
 for(const rel of files.keys())actual.set(rel,readActual(rel));
 const observed=projectionFingerprint(actual);
 assert.deepEqual(observed,expected,
  'Published source no longer matches exact reviewed in-memory projection; rollback required');
 return expected;
}
