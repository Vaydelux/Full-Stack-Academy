// Schema, cross-reference and snippet syntax gate for authored quick-reference drafts.
// Local filesystem/TypeScript only. Does not fetch URLs or call cloud services.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const references=JSON.parse(read('data/reference-details.json'));
const index=JSON.parse(read('data/reference-index.json'));
const curriculum=JSON.parse(read('data/curriculum.json'));
const referenceIndex=new Map(index.entries.map(e=>[e.id,e]));
const lessonIds=new Set(curriculum.lessons.map(e=>e.id));
const unique=new Set();
assert.equal(references.length,16,'Expect exactly 16 new React/Next reference drafts');
for(const ref of references){
 assert.ok(!unique.has(ref.id),'Duplicate authored reference '+ref.id);unique.add(ref.id);
 const indexed=referenceIndex.get(ref.id);
 assert.ok(indexed,'Authored reference must belong to the canonical 303-subject index: '+ref.id);
 assert.deepEqual(ref.matchCategories,[indexed.category],'Category mismatch for '+ref.id);
 assert.deepEqual(ref.matchTitles,[indexed.title],'Title mismatch for '+ref.id);
 assert.match(ref.heading,/.{15,}/);
 assert.ok(ref.summary.length>75,'Reference summary is too short: '+ref.id);
 for(const field of ['syntax','parameters','returns','minimalExample','productionExample']){
  assert.ok(typeof ref[field]==='string'&&ref[field].trim().length>=20,'Missing '+field+': '+ref.id);
 }
 assert.equal(ref.status,'Unverified draft');
 assert.ok(ref.commonMistakes.length>=2,'Expected real common mistakes: '+ref.id);
 assert.ok(ref.securityPerformanceNotes.length>=2,'Expected security/performance notes: '+ref.id);
 assert.ok(ref.relatedLessonIds.length>=1&&ref.relatedLessonIds.every(id=>lessonIds.has(id)),'Unknown related lesson: '+ref.id);
 assert.equal(new URL(ref.canonicalUrl).protocol,'https:','Official HTTPS docs required: '+ref.id);
 for(const field of ['minimalExample','productionExample']){
  const filename=ref.id+'.'+field+'.tsx';
  const parsed=ts.createSourceFile(filename,ref[field],ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const failures=parsed.parseDiagnostics||[];
  assert.deepEqual(failures.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')),[],'Syntax errors in '+filename);
 }
 assert.doesNotMatch(ref.minimalExample+ref.productionExample,/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,'Secrets must not enter reference examples');
}
const authored=read('src/lib/academy/authored-content.ts');
assert.match(authored,/\.\.\.supplementalReferences/,'Application reference renderer must import supplemental data');
const checkpoint=JSON.parse(read('docs/checkpoint.json'));
assert.equal(checkpoint.snapshot.authoredReferenceDrafts,20,'Checkpoint reference count drift');
console.log(JSON.stringify({status:'reference-drafts-structurally-valid',supplemental:references.length,legacy:4,total:20,canonicalIndex:index.entries.length,limits:['Examples are syntax parsed but not runtime integration tested','Status remains draft, not independently editorial verified']},null,2));
