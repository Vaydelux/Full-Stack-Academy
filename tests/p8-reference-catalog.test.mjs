import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AUTHORED_REFERENCES} from '../src/lib/academy/authored-content.ts';
const json = path => JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const index = json('data/reference-index.json').entries;
const lessons = new Set(json('data/curriculum.json').lessons.map(l=>l.id));
const ids = [
 'nestjs-useguards','nestjs-app-guard','nestjs-module','nestjs-injectable','nestjs-canactivate','nestjs-pipetransform','nestjs-nestinterceptor','nestjs-exceptionfilter',
 'postgresql-on-conflict','postgresql-transaction-isolation','postgresql-mvcc','postgresql-unique','postgresql-check','postgresql-returning',
 'prisma-findmany','prisma-select','prisma-transaction','prisma-queryraw',
 'supabase-getclaims','supabase-rls-policy','supabase-auth-uid','supabase-service-role-key',
 'redis-get','redis-set-ex','redis-scan','redis-attempts',
 'testing-vitest-test','testing-page-getbyrole','testing-idempotency-key','testing-dockerfile',
];
for (const id of ids) test(id+' has a unique canonical mapping and substantive example',()=>{
 const matches=AUTHORED_REFERENCES.filter(ref=>ref.id===id);
 assert.equal(matches.length,1);
 const ref=matches[0];
 const indexed=index.filter(entry=>ref.matchCategories.includes(entry.category)&&ref.matchTitles.includes(entry.title));
 assert.equal(indexed.length,1);
 assert.equal(indexed[0].id,id);
 assert.ok(ref.relatedLessonIds.length>0&&ref.relatedLessonIds.every(id=>lessons.has(id)));
 assert.notEqual(ref.minimalExample,ref.productionExample);
 for(const field of ['summary','syntax','parameters','returns','minimalExample','productionExample'])assert.ok(ref[field].trim(),field);
 assert.ok(ref.commonMistakes.length&&ref.securityPerformanceNotes.length);
 assert.equal(new URL(ref.canonicalUrl).protocol,'https:');
 assert.equal(ref.status,'Authored reference draft');
});

test('entire registry has unique IDs and unambiguous canonical category/title mappings',()=>{
 const ids=AUTHORED_REFERENCES.map(ref=>ref.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const entry of index){
  const matches=AUTHORED_REFERENCES.filter(ref=>ref.matchCategories.includes(entry.category)&&ref.matchTitles.includes(entry.title));
  assert.ok(matches.length<=1,'Overlapping reference match: '+entry.id);
  if(matches.length)assert.equal(matches[0].id,entry.id);
 }
});
