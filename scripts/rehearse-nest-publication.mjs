/** Full source projection rehearsal. No live writes, review evidence or approval. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODULES } from './nest-candidate-inventory.mjs';
import { projectNestModule } from './nest-release-projection.mjs';
import { projectionFingerprint } from './forms-query-projection-integrity.mjs';
import { inspectNestJsDrafts } from './verify-nestjs-drafts.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const json=p=>JSON.parse(read(p));
const [id,...extra]=process.argv.slice(2);
assert.ok(!extra.length&&(!id||MODULES.includes(id)),'Usage: npm run rehearse:nestjs -- [11.01–11.04]');
const audit=inspectNestJsDrafts();assert.deepEqual(audit.issues,[]);
const catalog=json('data/curriculum.json');
const results=(id?[id]:MODULES).map(moduleId=>{
 const module=audit.modules.find(m=>m.moduleId===moduleId);
 if(module.published===8)return {moduleId,status:'already-published',changesWritten:0};
 assert.equal(module.published,0);
 const pack=json('release-candidates/nestjs/'+moduleId+'/module.json');
 const writes=projectNestModule(pack,catalog,read,exists);
 return {moduleId,status:'source-rehearsal',...projectionFingerprint(writes),lessons:8,changesWritten:0};
});
console.log(JSON.stringify({results,runtimeExecuted:false,publicationApproved:false,warning:'Fixture review dates exist only in memory. No files were published. Actual framework, browser and human qualification remain mandatory.'},null,2));
