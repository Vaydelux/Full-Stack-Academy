import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {AUTHORED_REFERENCES} from '../src/lib/academy/authored-content.ts';
import {validateReferenceDrafts,referenceCoverage} from '../scripts/reference-quality.mjs';
import {buildReferenceLinks,relatedReferences,relatedCurriculum} from '../scripts/reference-links.mjs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const ids=[
  "nestjs-controller",
  "nestjs-get",
  "nestjs-post",
  "nestjs-inject",
  "nestjs-executioncontext",
  "nestjs-middleware",
  "nestjs-testingmodule",
  "nestjs-configmodule",
  "postgresql-select",
  "postgresql-insert",
  "postgresql-update",
  "postgresql-delete",
  "postgresql-join",
  "postgresql-group-by",
  "postgresql-having",
  "postgresql-order-by",
  "postgresql-limit",
  "postgresql-with",
  "postgresql-begin",
  "postgresql-commit",
  "postgresql-rollback",
  "postgresql-create-index",
  "postgresql-foreign-key",
  "postgresql-row-level-security",
  "prisma-model",
  "prisma-relation",
  "prisma-findunique",
  "prisma-create",
  "prisma-update",
  "prisma-delete",
  "prisma-upsert",
  "prisma-include",
  "prisma-cursor",
  "prisma-driver-adapter",
  "supabase-signinwithpassword",
  "supabase-getuser",
  "supabase-signout",
  "supabase-createsignedurl",
  "supabase-storage-bucket",
  "supabase-onauthstatechange",
  "redis-del",
  "redis-expire",
  "redis-ttl",
  "redis-incr",
  "redis-mget",
  "redis-hset",
  "redis-hget",
  "redis-sadd",
  "redis-zadd",
  "redis-bullmq-queue",
  "redis-worker",
  "redis-backoff",
  "redis-deduplication",
  "testing-vitest-describe",
  "testing-expect",
  "testing-vi-mock",
  "testing-beforeeach",
  "testing-playwright-test",
  "testing-docker-compose",
  "testing-pino-logger",
  "testing-slo",
  "testing-sli",
  "testing-runbook"
];
const entries=json('data/reference-index.json').entries,lessons=json('data/curriculum.json').lessons;
const batch=AUTHORED_REFERENCES.filter(ref=>ids.includes(ref.id));
test('F15 batch has exact canonical mappings, substantive draft fields and distinct examples',()=>{
 assert.equal(batch.length,ids.length);
 assert.equal(validateReferenceDrafts(batch,entries,lessons),ids.length);
});
test('F15 backend references are bidirectionally linked to their real canonical lessons',()=>{
 const graph=buildReferenceLinks(entries,AUTHORED_REFERENCES,lessons);
 for(const ref of batch) {
  const linked=relatedCurriculum(graph,lessons,ref.id);
  assert.ok(linked.length,ref.id);
  for(const lesson of linked)assert.ok(relatedReferences(graph,entries,lesson.id).some(x=>x.id===ref.id&&x.authored),ref.id+' '+lesson.id);
 }
});
test('reference coverage matches checkpoint without fabricating published lesson counts',()=>{
 const coverage=referenceCoverage(entries,AUTHORED_REFERENCES.map(ref=>ref.id));
 const snapshot=json('docs/checkpoint.json').snapshot;
 assert.equal(coverage.reduce((n,row)=>n+row.authored,0),snapshot.authoredReferenceDrafts);
 assert.equal(coverage.reduce((n,row)=>n+row.indexed,0),entries.length);
 assert.ok(snapshot.publishedLessons>=338,'Published lesson baseline regressed');
 assert.ok(snapshot.authoredMdxLessons>=337,'MDX lesson baseline regressed');
 // Reference authorship cannot fabricate lesson publication. Recompute the
 // checkpoint from actual lesson metadata, interactive IDs and lab manifests.
 execFileSync(process.execPath,['scripts/checkpoint-status.mjs','--check'],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',timeout:30000});
});
